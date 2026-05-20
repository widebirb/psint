using JobTracker.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobTracker.Api.Endpoints.Jobs;

public static class GetJobsEndpoint
{
    public static void Map(RouteGroupBuilder group)
    {
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
            var userId = principal.GetUserId();
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
                .ToListAsync();

            return Results.Ok(new PaginatedJobsResponse(
                jobs.Select(j => j.ToResponse()),
                total,
                page,
                page_size,
                (int)Math.Ceiling((double)total / page_size)
            ));
        });
    }
}