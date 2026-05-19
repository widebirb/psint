using JobTracker.Api.Auth;

namespace JobTracker.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        // called by the React frontend with the Google ID token Google Sign-In returns an ID token directly
        app.MapPost("/auth/google/token", async (TokenRequest request, GoogleAuthHandler handler) =>
        {
            try
            {
                var jwt = await handler.AuthenticateAsync(request.IdToken);
                return Results.Ok(new { token = jwt });
            }
            catch (Exception ex)
            {
                return Results.Unauthorized();
            }
        });
    }

    public record TokenRequest(string IdToken);
}