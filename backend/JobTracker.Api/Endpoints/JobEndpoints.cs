using JobTracker.Api.Data;
using JobTracker.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobTracker.Api.Endpoints;

public static class JobEndpoints
{
    public static void MapJobEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/jobs").RequireAuthorization();

        // GET /jobs, paginated, filtered, sorted
        group.MapGet("/", async (
            AppDbContext db,
            ClaimsPrincipal principal,
            int page = 1,
            int page_size = 10,
            string? sort_by = "created_at",
            string? sort_dir = "desc",
            string? status = null,
            string? source_site = null,
            string? search = null) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var query = db.Jobs
                .Where(j => j.UserId == userId.Value)
                .AsQueryable();

            // Filters
            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(j => j.Status == status);

            if (!string.IsNullOrWhiteSpace(source_site))
                query = query.Where(j => j.SourceSite == source_site);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(j =>
                    j.Title.ToLower().Contains(search.ToLower()) ||
                    j.Company.ToLower().Contains(search.ToLower()));

            // Sorting
            query = (sort_by, sort_dir) switch
            {
                ("title", "asc") => query.OrderBy(j => j.Title),
                ("title", _) => query.OrderByDescending(j => j.Title),
                ("company", "asc") => query.OrderBy(j => j.Company),
                ("company", _) => query.OrderByDescending(j => j.Company),
                ("status", "asc") => query.OrderBy(j => j.Status),
                ("status", _) => query.OrderByDescending(j => j.Status),
                ("date_posted", "asc") => query.OrderBy(j => j.DatePosted),
                ("date_posted", _) => query.OrderByDescending(j => j.DatePosted),
                ("created_at", "asc") => query.OrderBy(j => j.CreatedAt),
                _ => query.OrderByDescending(j => j.CreatedAt),
            };

            var total = await query.CountAsync();

            var jobs = await query
                .Skip((page - 1) * page_size)
                .Take(page_size)
                .Select(j => MapJob(j))
                .ToListAsync();

            return Results.Ok(new
            {
                data = jobs,
                total,
                page,
                page_size,
                total_pages = (int)Math.Ceiling((double)total / page_size),
            });
        });

        // POST /jobs
        group.MapPost("/", async (
            AppDbContext db,
            ClaimsPrincipal principal,
            CreateJobRequest req) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var job = new Job
            {
                UserId = userId.Value,
                Title = req.Title,
                Company = req.Company,
                Location = req.Location,
                JobType = req.JobType,
                SalaryRange = req.SalaryRange,
                DescriptionUrl = req.DescriptionUrl,
                SourceSite = req.SourceSite,
                DatePosted = req.DatePosted,
                Status = req.Status ?? "saved",
                Notes = req.Notes,
            };

            db.Jobs.Add(job);
            await db.SaveChangesAsync();

            return Results.Created($"/jobs/{job.Id}", MapJob(job));
        });

        // PATCH /jobs/{id}
        group.MapPatch("/{id:guid}", async (
            AppDbContext db,
            ClaimsPrincipal principal,
            Guid id,
            UpdateJobRequest req) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var job = await db.Jobs.FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId.Value);
            if (job is null) return Results.NotFound();

            if (req.Title is not null) job.Title = req.Title;
            if (req.Company is not null) job.Company = req.Company;
            if (req.Location is not null) job.Location = req.Location;
            if (req.JobType is not null) job.JobType = req.JobType;
            if (req.SalaryRange is not null) job.SalaryRange = req.SalaryRange;
            if (req.DescriptionUrl is not null) job.DescriptionUrl = req.DescriptionUrl;
            if (req.Status is not null) job.Status = req.Status;
            if (req.Notes is not null) job.Notes = req.Notes;

            job.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();

            return Results.Ok(MapJob(job));
        });

        // DELETE /jobs/{id}
        group.MapDelete("/{id:guid}", async (
            AppDbContext db,
            ClaimsPrincipal principal,
            Guid id) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var job = await db.Jobs.FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId.Value);
            if (job is null) return Results.NotFound();

            db.Jobs.Remove(job);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }

    // Helpers 

    private static Guid? GetUserId(ClaimsPrincipal principal)
    {
        var raw = principal.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(raw, out var id) ? id : null;
    }

    private static object MapJob(Job j) => new
    {
        id = j.Id,
        user_id = j.UserId,
        title = j.Title,
        company = j.Company,
        location = j.Location,
        job_type = j.JobType,
        salary_range = j.SalaryRange,
        description_url = j.DescriptionUrl,
        source_site = j.SourceSite,
        date_posted = j.DatePosted,
        status = j.Status,
        notes = j.Notes,
        created_at = j.CreatedAt,
        updated_at = j.UpdatedAt,
    };

    //  Request records 

    public record CreateJobRequest(
        string Title,
        string Company,
        string? Location,
        string? JobType,
        string? SalaryRange,
        string? DescriptionUrl,
        string? SourceSite,
        DateOnly? DatePosted,
        string? Status,
        string? Notes
    );

    public record UpdateJobRequest(
        string? Title,
        string? Company,
        string? Location,
        string? JobType,
        string? SalaryRange,
        string? DescriptionUrl,
        string? Status,
        string? Notes
    );
}