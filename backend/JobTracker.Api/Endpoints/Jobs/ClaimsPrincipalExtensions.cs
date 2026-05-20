using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace JobTracker.Api.Endpoints.Jobs;

public static class ClaimsPrincipalExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var raw = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(raw, out var id) ? id : null;
    }
}