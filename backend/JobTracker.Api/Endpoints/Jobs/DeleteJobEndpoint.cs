using JobTracker.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobTracker.Api.Endpoints.Jobs;

public static class DeleteJobEndpoint
{
    public static void Map(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:guid}", async (
            AppDbContext db,
            ClaimsPrincipal principal,
            Guid id) =>
        {
            var userId = principal.GetUserId();
            if (userId is null) return Results.Unauthorized();

            var job = await db.Jobs
                .FirstOrDefaultAsync(j => j.Id == id && j.UserId == userId.Value);

            if (job is null) return Results.NotFound();

            db.Jobs.Remove(job);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}