using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Velessa.Application.Common.Interfaces;

namespace Velessa.Infrastructure.Services;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<GoogleAuthService> _logger;

    public GoogleAuthService(IConfiguration configuration, ILogger<GoogleAuthService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<(bool Valid, string? GoogleId, string? Email, string? FirstName, string? LastName, string? Picture)> ValidateGoogleTokenAsync(
        string idToken,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(idToken))
        {
            return (false, null, null, null, null, null);
        }

        // 1. Simulation/Demo handler for seamless local testing without Google Cloud credentials
        if (idToken.StartsWith("demo_google_token:", StringComparison.OrdinalIgnoreCase))
        {
            var parts = idToken.Split(':', 4);
            var email = parts.Length > 1 ? parts[1] : "patron@example.com";
            var firstName = parts.Length > 2 ? parts[2] : "Dev";
            var lastName = parts.Length > 3 ? parts[3] : "Patron";
            var googleId = "google-demo-" + Math.Abs(email.GetHashCode());

            _logger.LogInformation("Simulated Google Token accepted for: {Email}", email);
            return (true, googleId, email, firstName, lastName, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
        }

        // 2. Real Google cryptographic validation
        try
        {
            var clientId = _configuration["Google:ClientId"];
            var settings = new GoogleJsonWebSignature.ValidationSettings();
            
            if (!string.IsNullOrEmpty(clientId) && clientId != "YOUR_GOOGLE_CLIENT_ID")
            {
                settings.Audience = new[] { clientId };
            }

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            if (payload == null)
            {
                _logger.LogWarning("Google Token validation failed: payload was null");
                return (false, null, null, null, null, null);
            }

            return (
                true,
                payload.Subject,
                payload.Email,
                payload.GivenName ?? payload.Name?.Split(' ').FirstOrDefault() ?? "Patron",
                payload.FamilyName ?? payload.Name?.Split(' ').Skip(1).FirstOrDefault() ?? string.Empty,
                payload.Picture
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to validate Google token with Google public keys");
            return (false, null, null, null, null, null);
        }
    }
}
