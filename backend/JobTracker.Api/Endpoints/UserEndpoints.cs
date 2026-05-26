using JobTracker.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobTracker.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        app.MapGet("/me", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Results.Unauthorized();

            var user = await db.Users.FindAsync(Guid.Parse(userId));
            if (user is null) return Results.NotFound();

            return Results.Ok(new
            {
                id = user.Id,
                email = user.Email,
                name = user.Name,
                avatar_url = user.AvatarUrl,
                created_at = user.CreatedAt,
            });
        }).RequireAuthorization();
    }
}