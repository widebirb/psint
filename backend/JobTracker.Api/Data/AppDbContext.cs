using Microsoft.EntityFrameworkCore;
using JobTracker.Api.Models;

namespace JobTracker.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Job> Jobs => Set<Job>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id).HasColumnName("id");
            e.Property(u => u.GoogleId).HasColumnName("google_id").IsRequired();
            e.Property(u => u.Email).HasColumnName("email").IsRequired();
            e.Property(u => u.Name).HasColumnName("name");
            e.Property(u => u.AvatarUrl).HasColumnName("avatar_url");
            e.Property(u => u.CreatedAt).HasColumnName("created_at");
            e.HasIndex(u => u.GoogleId).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Job>(e =>
        {
            e.ToTable("jobs");
            e.HasKey(j => j.Id);
            e.Property(j => j.Id).HasColumnName("id");
            e.Property(j => j.UserId).HasColumnName("user_id");
            e.Property(j => j.Title).HasColumnName("title").IsRequired();
            e.Property(j => j.Company).HasColumnName("company").IsRequired();
            e.Property(j => j.Location).HasColumnName("location");
            e.Property(j => j.JobType).HasColumnName("job_type");
            e.Property(j => j.SalaryRange).HasColumnName("salary_range");
            e.Property(j => j.DescriptionUrl).HasColumnName("description_url");
            e.Property(j => j.SourceSite).HasColumnName("source_site");
            e.Property(j => j.DatePosted).HasColumnName("date_posted");
            e.Property(j => j.Status).HasColumnName("status").IsRequired();
            e.Property(j => j.Notes).HasColumnName("notes");
            e.Property(j => j.CreatedAt).HasColumnName("created_at");
            e.Property(j => j.UpdatedAt).HasColumnName("updated_at");

            e.HasOne(j => j.User)
             .WithMany(u => u.Jobs)
             .HasForeignKey(j => j.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}