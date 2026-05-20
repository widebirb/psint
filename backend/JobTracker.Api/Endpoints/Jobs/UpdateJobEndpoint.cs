using JobTracker.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobTracker.Api.Endpoints.Jobs;

public static class UpdateJobEndpoint
{
    public static void Map(RouteGroupBuilder group)
    {
        group.MapPatch("/{id:guid}", async (
            AppDbContext db,
            ClaimsPrincipal principal,
            Guid id,
            UpdateJobRequest req) =>
        {
            var userId = principal.GetUserId();
            if (userId is null) return Results.Unauthorized();

            var job = await db.Jobs
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId.Value);

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

            return Results.Ok(job.ToResponse());
        });
    }
}