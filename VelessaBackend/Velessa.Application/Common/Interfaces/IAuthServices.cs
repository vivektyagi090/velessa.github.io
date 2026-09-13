using Velessa.Domain.Entities;

namespace Velessa.Application.Common.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    string GenerateTempToken(string email, string? firstName, string? lastName, string? googleId);
    (bool Valid, string? Email, string? FirstName, string? LastName, string? GoogleId) ValidateTempToken(string tempToken);
    string GenerateResetPasswordToken(string phoneNumber, string email);
    (bool Valid, string? PhoneNumber, string? Email) ValidateResetPasswordToken(string resetToken);
}

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}

public interface IOtpService
{
    Task<(bool Success, string Message, string OtpCode)> GenerateAndSendOtpAsync(string phoneNumber, string? tempIdentifier, CancellationToken cancellationToken = default);
    Task<bool> VerifyOtpAsync(string phoneNumber, string otpCode, string? tempIdentifier, CancellationToken cancellationToken = default);
}

public interface IGoogleAuthService
{
    Task<(bool Valid, string? GoogleId, string? Email, string? FirstName, string? LastName, string? Picture)> ValidateGoogleTokenAsync(string idToken, CancellationToken cancellationToken = default);
}
