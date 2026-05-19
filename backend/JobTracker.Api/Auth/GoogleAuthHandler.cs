using Google.Apis.Auth;
using JobTracker.Api.Data;
using JobTracker.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JobTracker.Api.Auth;

public class GoogleAuthHandler(AppDbContext db, IConfiguration config)
{
    public async Task<string> AuthenticateAsync(string idToken)
    {
        // Validate the Google ID token
        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = [config["GOOGLE_CLIENT_ID"]]
        });

        // Upsert user
        var user = await db.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);

        if (user is null)
        {
            user = new User
            {
                GoogleId = payload.Subject,
                Email = payload.Email,
                Name = payload.Name,
                AvatarUrl = payload.Picture,
            };
            db.Users.Add(user);
        }
        else
        {
            user.Name = payload.Name;
            user.AvatarUrl = payload.Picture;
        }

        await db.SaveChangesAsync();
        return IssueJwt(user);
    }

    private string IssueJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT_SECRET"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Name,  user.Name ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: config["JWT_ISSUER"],
            audience: config["JWT_AUDIENCE"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}