using JobTracker.Api.Data;
using JobTracker.Api.Models;
using Microsoft.Extensions.DependencyInjection;

namespace JobTracker.Tests.Infrastructure;

public static class DbHelper
{
    public static async Task<User> CreateUserAsync(IServiceProvider services, string email = "test@example.com")
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var user = new User
        {
            GoogleId = Guid.NewGuid().ToString(),
            Email = email,
            Name = "Test User",
            AvatarUrl = null,
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public static async Task<Job> CreateJobAsync(IServiceProvider services, Guid userId, string title = "Software Engineer", string status = "saved")
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var job = new Job
        {
            UserId = userId,
            Title = title,
            Company = "Test Corp",
            Status = status,
        };

        db.Jobs.Add(job);
        await db.SaveChangesAsync();
        return job;
    }

    public static async Task ClearJobsAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Jobs.RemoveRange(db.Jobs);
        await db.SaveChangesAsync();
    }

    public static async Task ClearAllAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Jobs.RemoveRange(db.Jobs);
        db.Users.RemoveRange(db.Users);
        await db.SaveChangesAsync();
    }
}