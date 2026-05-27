using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using JobTracker.Tests.Infrastructure;
using JobTracker.Api.Models;
using Xunit;

namespace JobTracker.Tests.Endpoints;

[Collection("Integration")]
public class JobEndpointTests : IAsyncLifetime
{
    private readonly JobTrackerFactory _factory;
    private readonly HttpClient _client;
    private User _user = null!;

    public JobEndpointTests(JobTrackerFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    //creates a fresh user and sets auth header in each test
    public async Task InitializeAsync()
    {
        _user = await DbHelper.CreateUserAsync(_factory.Services);
        var token = AuthHelper.GenerateToken(_user.Id, _user.Email);
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
    }

    //cleans up so tests don't bleed into each other
    public async Task DisposeAsync()
    {
        await DbHelper.ClearAllAsync(_factory.Services);
        _client.DefaultRequestHeaders.Authorization = null;
    }

    // GET /jobs 

    [Fact]
    public async Task GetJobs_WithoutToken_Returns401()
    {
        var anonClient = _factory.CreateClient();
        var response = await anonClient.GetAsync("/jobs");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetJobs_EmptyForNewUser_ReturnsEmptyList()
    {
        var response = await _client.GetAsync("/jobs");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal(0, body.GetProperty("total").GetInt32());
        Assert.Equal(0, body.GetProperty("data").GetArrayLength());
    }

    [Fact]
    public async Task GetJobs_ReturnsPaginatedResults()
    {
        // Seed 3 jobs
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Job A");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Job B");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Job C");

        var response = await _client.GetAsync("/jobs?page=1&page_size=2");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal(3, body.GetProperty("total").GetInt32());
        Assert.Equal(2, body.GetProperty("data").GetArrayLength());
        Assert.Equal(2, body.GetProperty("total_pages").GetInt32());
    }

    [Fact]
    public async Task GetJobs_FilterByStatus_ReturnsMatchingJobs()
    {
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Applied Job", status: "applied");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Saved Job", status: "saved");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Rejected Job", status: "rejected");

        var response = await _client.GetAsync("/jobs?status=applied");
        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal(1, body.GetProperty("total").GetInt32());
        Assert.Equal("Applied Job",
            body.GetProperty("data")[0].GetProperty("title").GetString());
    }

    [Fact]
    public async Task GetJobs_SearchByTitle_ReturnsMatchingJobs()
    {
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Frontend Developer");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Backend Engineer");

        var response = await _client.GetAsync("/jobs?search=frontend");
        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal(1, body.GetProperty("total").GetInt32());
        Assert.Equal("Frontend Developer",
            body.GetProperty("data")[0].GetProperty("title").GetString());
    }

    [Fact]
    public async Task GetJobs_SortByTitleAsc_ReturnsSortedJobs()
    {
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Zebra Role");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Alpha Role");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "Middle Role");

        var response = await _client.GetAsync("/jobs?sort_by=title&sort_dir=asc");
        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        var titles = body.GetProperty("data")
            .EnumerateArray()
            .Select(j => j.GetProperty("title").GetString())
            .ToList();

        Assert.Equal(["Alpha Role", "Middle Role", "Zebra Role"], titles);
    }

    [Fact]
    public async Task GetJobs_DoesNotReturnOtherUsersJobs()
    {
        var otherUser = await DbHelper.CreateUserAsync(_factory.Services, "other@example.com");
        await DbHelper.CreateJobAsync(_factory.Services, otherUser.Id, "Other User Job");
        await DbHelper.CreateJobAsync(_factory.Services, _user.Id, "My Job");

        var response = await _client.GetAsync("/jobs");
        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal(1, body.GetProperty("total").GetInt32());
        Assert.Equal("My Job",
            body.GetProperty("data")[0].GetProperty("title").GetString());
    }

    // POST /jobs 

    [Fact]
    public async Task CreateJob_ValidPayload_ReturnsCreatedJob()
    {
        var payload = new
        {
            title = "Software Engineer",
            company = "Acme Corp",
            location = "Remote",
            status = "saved",
            source_site = "manual",
        };

        var response = await _client.PostAsJsonAsync("/jobs", payload);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal("Software Engineer", body.GetProperty("title").GetString());
        Assert.Equal("Acme Corp", body.GetProperty("company").GetString());
        Assert.Equal("saved", body.GetProperty("status").GetString());
        Assert.NotEqual(Guid.Empty.ToString(), body.GetProperty("id").GetString());
    }

    [Fact]
    public async Task CreateJob_MissingRequiredFields_Returns400()
    {
        var payload = new { location = "Remote" }; // missing title and company
        var response = await _client.PostAsJsonAsync("/jobs", payload);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    //  PATCH /jobs/{id} 

    [Fact]
    public async Task UpdateJob_ValidPayload_ReturnsUpdatedJob()
    {
        var job = await DbHelper.CreateJobAsync(_factory.Services, _user.Id);

        var payload = new { status = "applied", notes = "Great company" };
        var response = await _client.PatchAsJsonAsync($"/jobs/{job.Id}", payload);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal("applied", body.GetProperty("status").GetString());
        Assert.Equal("Great company", body.GetProperty("notes").GetString());
    }

    [Fact]
    public async Task UpdateJob_OtherUsersJob_Returns404()
    {
        var otherUser = await DbHelper.CreateUserAsync(_factory.Services, "other2@example.com");
        var job = await DbHelper.CreateJobAsync(_factory.Services, otherUser.Id);

        var payload = new { status = "applied" };
        var response = await _client.PatchAsJsonAsync($"/jobs/{job.Id}", payload);

        // 404 not 403 bcuz we don't reveal that the job exists
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateJob_NonExistentId_Returns404()
    {
        var payload = new { status = "applied" };
        var response = await _client.PatchAsJsonAsync($"/jobs/{Guid.NewGuid()}", payload);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    // DELETE /jobs/{id} 

    [Fact]
    public async Task DeleteJob_OwnJob_Returns204()
    {
        var job = await DbHelper.CreateJobAsync(_factory.Services, _user.Id);
        var response = await _client.DeleteAsync($"/jobs/{job.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // confirm it's actually gone
        var listResponse = await _client.GetAsync("/jobs");
        var body = JsonSerializer.Deserialize<JsonElement>(
            await listResponse.Content.ReadAsStringAsync());
        Assert.Equal(0, body.GetProperty("total").GetInt32());
    }

    [Fact]
    public async Task DeleteJob_OtherUsersJob_Returns404()
    {
        var otherUser = await DbHelper.CreateUserAsync(_factory.Services, "other3@example.com");
        var job = await DbHelper.CreateJobAsync(_factory.Services, otherUser.Id);
        var response = await _client.DeleteAsync($"/jobs/{job.Id}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteJob_NonExistentId_Returns404()
    {
        var response = await _client.DeleteAsync($"/jobs/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}