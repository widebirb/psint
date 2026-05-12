namespace JobTracker.Api.Models;

public class Job
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? JobType { get; set; }
    public string? SalaryRange { get; set; }
    public string? DescriptionUrl { get; set; }
    public string? SourceSite { get; set; }
    public DateOnly? DatePosted { get; set; }
    public string Status { get; set; } = "saved";
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}