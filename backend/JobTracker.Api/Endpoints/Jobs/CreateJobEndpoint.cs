using JobTracker.Api.Data;
using JobTracker.Api.Models;
using System.Security.Claims;

namespace JobTracker.Api.Endpoints.Jobs;

public static class CreateJobEndpoint
{
    public static void Map(RouteGroupBuilder group)
    {
        group.MapPost("/", async (
            AppDbContext db,
            ClaimsPrincipal principal,
            CreateJobRequest req) =>
        {
            var userId = principal.GetUserId();
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

            return Results.Created($"/jobs/{job.Id}", job.ToResponse());
        });
    }
}