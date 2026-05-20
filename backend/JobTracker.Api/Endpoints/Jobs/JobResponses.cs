using JobTracker.Api.Models;

namespace JobTracker.Api.Endpoints.Jobs;

public record JobResponse(
    Guid Id,
    Guid UserId,
    string Title,
    string Company,
    string? Location,
    string? JobType,
    string? SalaryRange,
    string? DescriptionUrl,
    string? SourceSite,
    DateOnly? DatePosted,
    string Status,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record PaginatedJobsResponse(
    IEnumerable<JobResponse> Data,
    int Total,
    int Page,
    int PageSize,
    int TotalPages
);

public static class JobMapper
{
    public static JobResponse ToResponse(this Job job) => new(
        job.Id,
        job.UserId,
        job.Title,
        job.Company,
        job.Location,
        job.JobType,
        job.SalaryRange,
        job.DescriptionUrl,
        job.SourceSite,
        job.DatePosted,
        job.Status,
        job.Notes,
        job.CreatedAt,
        job.UpdatedAt
    );
}