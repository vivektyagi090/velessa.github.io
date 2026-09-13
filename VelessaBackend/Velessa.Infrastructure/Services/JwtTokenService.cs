using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Velessa.Application.Common.Interfaces;
using Velessa.Domain.Entities;

namespace Velessa.Infrastructure.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        _secretKey = _configuration["Jwt:Secret"] ?? "VelessaHauteJoaillerieUltraSecretKey2026MasterKey!@#$";
        _issuer = _configuration["Jwt:Issuer"] ?? "VelessaAPI";
        _audience = _configuration["Jwt:Audience"] ?? "VelessaApp";
    }

    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.GivenName, user.FirstName),
            new(ClaimTypes.Surname, user.LastName),
            new(ClaimTypes.Role, user.Role),
            new("tier", user.Tier),
            new("isPhoneVerified", user.IsPhoneVerified.ToString().ToLower()),
        };

        if (!string.IsNullOrEmpty(user.PhoneNumber))
        {
            claims.Add(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string GenerateTempToken(string email, string? firstName, string? lastName, string? googleId)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        var claims = new List<Claim>
        {
            new("temp_purpose", "google_phone_verification"),
            new(ClaimTypes.Email, email),
            new(ClaimTypes.GivenName, firstName ?? string.Empty),
            new(ClaimTypes.Surname, lastName ?? string.Empty),
            new("google_id", googleId ?? string.Empty),
            new("jti", Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(15),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public (bool Valid, string? Email, string? FirstName, string? LastName, string? GoogleId) ValidateTempToken(string tempToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        try
        {
            var principal = tokenHandler.ValidateToken(tempToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            var purpose = principal.FindFirst("temp_purpose")?.Value;
            if (purpose != "google_phone_verification")
            {
                return (false, null, null, null, null);
            }

            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            var firstName = principal.FindFirst(ClaimTypes.GivenName)?.Value;
            var lastName = principal.FindFirst(ClaimTypes.Surname)?.Value;
            var googleId = principal.FindFirst("google_id")?.Value;

            return (true, email, firstName, lastName, googleId);
        }
        catch
        {
            return (false, null, null, null, null);
        }
    }

    public string GenerateResetPasswordToken(string phoneNumber, string email)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        var claims = new List<Claim>
        {
            new("temp_purpose", "password_reset"),
            new(ClaimTypes.MobilePhone, phoneNumber),
            new(ClaimTypes.Email, email),
            new("jti", Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(15),
            Issuer = _issuer,
            Audience = _audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public (bool Valid, string? PhoneNumber, string? Email) ValidateResetPasswordToken(string resetToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        try
        {
            var principal = tokenHandler.ValidateToken(resetToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            var purpose = principal.FindFirst("temp_purpose")?.Value;
            if (purpose != "password_reset")
            {
                return (false, null, null);
            }

            var phone = principal.FindFirst(ClaimTypes.MobilePhone)?.Value;
            var email = principal.FindFirst(ClaimTypes.Email)?.Value;

            return (true, phone, email);
        }
        catch
        {
            return (false, null, null);
        }
    }
}
