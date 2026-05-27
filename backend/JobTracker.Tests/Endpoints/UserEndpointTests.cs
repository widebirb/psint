using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using JobTracker.Tests.Infrastructure;
using Xunit;

namespace JobTracker.Tests.Endpoints;

[Collection("Integration")]
public class UserEndpointTests(JobTrackerFactory factory)
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task GetMe_WithoutToken_Returns401()
    {
        var response = await _client.GetAsync("/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMe_WithValidToken_ReturnsUserProfile()
    {
        var user = await DbHelper.CreateUserAsync(factory.Services);
        var token = AuthHelper.GenerateToken(user.Id, user.Email);

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/me");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = JsonSerializer.Deserialize<JsonElement>(
            await response.Content.ReadAsStringAsync());

        Assert.Equal(user.Email, body.GetProperty("email").GetString());
        Assert.Equal(user.Name, body.GetProperty("name").GetString());

        // Cleanup
        await DbHelper.ClearAllAsync(factory.Services);
        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task GetMe_WithTokenForNonExistentUser_Returns404()
    {
        var token = AuthHelper.GenerateToken(Guid.NewGuid());

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var response = await _client.GetAsync("/me");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        _client.DefaultRequestHeaders.Authorization = null;
    }
}