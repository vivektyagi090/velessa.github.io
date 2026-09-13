namespace Velessa.Application.DTOs;

public record UserDto(
    int Id,
    string Email,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    bool IsPhoneVerified,
    string? AvatarUrl,
    string Tier,
    string MemberSince,
    string Role,
    DateTime? LastLoginAtUtc = null
);

public record LoginRequestDto(
    string Email, // email or mobile number
    string Password
);

public record MobileLoginOtpDto(
    string PhoneNumber,
    string OtpCode
);

public record UpdateProfileRequestDto(
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string? OtpCode = null
);

public record ForgotPasswordRequestDto(
    string Identifier // email or mobile number
);

public record ForgotPasswordResponseDto(
    bool Success,
    string Message,
    bool IsMobile,
    string? PhoneNumber,
    int ExpirySeconds,
    string? DevOtp = null
);

public record VerifyResetOtpRequestDto(
    string Identifier, // mobile number or email
    string OtpCode
);

public record VerifyResetOtpResponseDto(
    bool Success,
    string Message,
    string? ResetToken
);

public record ResetPasswordRequestDto(
    string? Identifier, // mobile number or email
    string? OtpCode,
    string? ResetToken,
    string NewPassword
);

public record RegisterRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string PhoneNumber,
    string OtpCode
);

public record RegisterShopkeeperRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string PhoneNumber,
    string? StoreName = null,
    string? StoreLocation = null,
    string? Gstin = null
);

public record GoogleLoginRequestDto(
    string Credential
);

public record SendOtpRequestDto(
    string PhoneNumber,
    string? TempToken
);

public record SendOtpResponseDto(
    bool Success,
    string Message,
    int ExpirySeconds,
    string? DevOtp = null
);

public record VerifyGooglePhoneDto(
    string TempToken,
    string PhoneNumber,
    string OtpCode
);

public record AuthResponseDto(
    string? Token,
    UserDto? User,
    bool RequiresPhoneVerification,
    string? TempToken,
    string? Email = null,
    string? FirstName = null,
    string? LastName = null
);

public record CheckoutVerifyPhoneDto(
    string PhoneNumber,
    string OtpCode,
    string FirstName,
    string LastName,
    string Email
);
