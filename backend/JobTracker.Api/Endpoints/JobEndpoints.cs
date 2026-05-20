using JobTracker.Api.Endpoints.Jobs;

namespace JobTracker.Api.Endpoints;

public static class JobEndpoints
{
    public static void MapJobEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/jobs").RequireAuthorization();

        GetJobsEndpoint.Map(group);
        CreateJobEndpoint.Map(group);
        UpdateJobEndpoint.Map(group);
        DeleteJobEndpoint.Map(group);
    }
}