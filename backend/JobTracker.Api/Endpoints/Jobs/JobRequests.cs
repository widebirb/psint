namespace JobTracker.Api.Endpoints.Jobs;

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