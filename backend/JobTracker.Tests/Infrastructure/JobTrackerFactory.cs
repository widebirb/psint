using JobTracker.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace JobTracker.Tests.Infrastructure;

public class JobTrackerFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder("postgres:15.1")
        .WithDatabase("jobtracker_test")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("JWT_SECRET", "test-secret-key-that-is-long-enough-32chars");
        builder.UseSetting("JWT_ISSUER", "jobtracker-test");
        builder.UseSetting("JWT_AUDIENCE", "jobtracker-test-client");
        builder.UseSetting("FRONTEND_URL", "http://localhost:5173");
        builder.UseSetting("GOOGLE_CLIENT_ID", "test-google-client-id");
        builder.UseSetting("GOOGLE_CLIENT_SECRET", "test-google-client-secret");
        builder.UseSetting("DB_CONNECTION_STRING", _container.GetConnectionString());

        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor is not null)
                services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(_container.GetConnectionString()));

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate();
        });
    }

    public async Task InitializeAsync() => await _container.StartAsync();

    public new async Task DisposeAsync()
    {
        await _container.DisposeAsync();
        await base.DisposeAsync();
    }
}