using JobTracker.Api.Auth;
using System.Text.Json.Serialization;

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
                Console.WriteLine($"Auth error: {ex.Message}");
                return Results.Unauthorized();
            }
        });
    }

    public record TokenRequest(
        [property: JsonPropertyName("id_token")] string IdToken
    );
}