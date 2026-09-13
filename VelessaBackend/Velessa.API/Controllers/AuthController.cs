using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Velessa.Application.Common.Interfaces;
using Velessa.Application.DTOs;
using Velessa.Domain.Entities;

namespace Velessa.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IOtpService _otpService;
    private readonly IGoogleAuthService _googleAuthService;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        IJwtTokenService jwtTokenService,
        IOtpService otpService,
        IGoogleAuthService googleAuthService,
        IWebHostEnvironment env,
        ILogger<AuthController> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
        _otpService = otpService;
        _googleAuthService = googleAuthService;
        _env = env;
        _logger = logger;
    }

    /// <summary>
    /// Register a new user with verified mobile number via OTP
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        if (string.IsNullOrWhiteSpace(dto.PhoneNumber))
        {
            return BadRequest(new { message = "Mobile number is required for membership registration." });
        }

        if (string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            return BadRequest(new { message = "6-digit OTP verification code is required to verify your mobile number." });
        }

        var cleanedPhone = dto.PhoneNumber.Replace(" ", "").Replace("-", "").Trim();
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        // 1. Check if email already registered
        var emailExists = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);
        if (emailExists)
        {
            return Conflict(new { message = "An account with this email address is already registered." });
        }

        // 2. Check if phone number already registered
        var phoneExists = await _context.Users.AnyAsync(u => u.PhoneNumber == cleanedPhone, cancellationToken);
        if (phoneExists)
        {
            return Conflict(new { message = "An account with this mobile number is already registered." });
        }

        // 3. Verify OTP code for phone number
        var otpValid = await _otpService.VerifyOtpAsync(cleanedPhone, dto.OtpCode, null, cancellationToken);
        if (!otpValid)
        {
            return BadRequest(new { message = "Invalid or expired OTP verification code. Please request a new code." });
        }

        // 4. Create user with verified phone
        var user = new User
        {
            Email = normalizedEmail,
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            PhoneNumber = cleanedPhone,
            IsPhoneVerified = true,
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            Tier = "Velessa Circle",
            Role = "Customer",
            CreatedAtUtc = DateTime.UtcNow,
            LastLoginAtUtc = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenService.GenerateToken(user);
        var userDto = MapToDto(user);

        return Ok(new AuthResponseDto(
            Token: token,
            User: userDto,
            RequiresPhoneVerification: false,
            TempToken: null
        ));
    }

    /// <summary>
    /// Register a new merchant / shopkeeper with store credentials and Vault Level-1 clearance
    /// </summary>
    [HttpPost("register-shopkeeper")]
    public async Task<ActionResult<AuthResponseDto>> RegisterShopkeeper([FromBody] RegisterShopkeeperRequestDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        if (string.IsNullOrWhiteSpace(dto.PhoneNumber))
        {
            return BadRequest(new { message = "Mobile number is required for merchant onboarding." });
        }

        if (string.IsNullOrWhiteSpace(dto.FirstName))
        {
            return BadRequest(new { message = "Full name is required." });
        }

        var cleanedPhone = dto.PhoneNumber.Replace(" ", "").Replace("-", "").Trim();
        var normalizedEmail = dto.Email.Trim().ToLowerInvariant();

        // 1. Check if email already registered
        var emailExists = await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);
        if (emailExists)
        {
            return Conflict(new { message = "An account with this email address is already registered." });
        }

        // 2. Check if phone number already registered
        var phoneExists = await _context.Users.AnyAsync(u => u.PhoneNumber == cleanedPhone, cancellationToken);
        if (phoneExists)
        {
            return Conflict(new { message = "An account with this mobile number is already registered." });
        }

        // 3. Create user with Shopkeeper role
        var user = new User
        {
            Email = normalizedEmail,
            FirstName = dto.FirstName.Trim(),
            LastName = (dto.LastName ?? "").Trim(),
            PhoneNumber = cleanedPhone,
            IsPhoneVerified = true,
            PasswordHash = _passwordHasher.HashPassword(dto.Password),
            Tier = "Haute Joaillerie VIP",
            Role = "Shopkeeper",
            CreatedAtUtc = DateTime.UtcNow,
            LastLoginAtUtc = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenService.GenerateToken(user);
        var userDto = MapToDto(user);

        return Ok(new AuthResponseDto(
            Token: token,
            User: userDto,
            RequiresPhoneVerification: false,
            TempToken: null
        ));
    }

    /// <summary>
    /// Login with existing email OR mobile number and password
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "Email or mobile number, and password are required." });
        }

        var identifier = dto.Email.Trim();
        var normalizedEmail = identifier.ToLowerInvariant();
        var cleanedPhone = identifier.Replace(" ", "").Replace("-", "").Replace("+", "");

        // Find user by Email OR Mobile Number (flexible with or without country code)
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email.ToLower() == normalizedEmail ||
                (u.PhoneNumber != null && (
                    u.PhoneNumber == identifier ||
                    u.PhoneNumber == "+" + cleanedPhone ||
                    u.PhoneNumber == cleanedPhone ||
                    (cleanedPhone.Length >= 10 && u.PhoneNumber.EndsWith(cleanedPhone))
                )), cancellationToken);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash) || !_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email/mobile number or password credentials." });
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenService.GenerateToken(user);
        var userDto = MapToDto(user);

        return Ok(new AuthResponseDto(
            Token: token,
            User: userDto,
            RequiresPhoneVerification: false,
            TempToken: null
        ));
    }

    /// <summary>
    /// Login directly with Mobile Number and verified OTP (passwordless)
    /// </summary>
    [HttpPost("login-with-otp")]
    public async Task<ActionResult<AuthResponseDto>> LoginWithOtp([FromBody] MobileLoginOtpDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.PhoneNumber) || string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            return BadRequest(new { message = "Mobile number and OTP code are required." });
        }

        var cleanedPhone = dto.PhoneNumber.Replace(" ", "").Replace("-", "").Trim();
        var otpValid = await _otpService.VerifyOtpAsync(cleanedPhone, dto.OtpCode, null, cancellationToken);
        if (!otpValid)
        {
            return BadRequest(new { message = "Invalid or expired OTP verification code." });
        }

        var phoneDigits = cleanedPhone.Replace("+", "");
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.PhoneNumber != null && (
                u.PhoneNumber == cleanedPhone ||
                u.PhoneNumber == "+" + phoneDigits ||
                u.PhoneNumber == phoneDigits ||
                (phoneDigits.Length >= 10 && u.PhoneNumber.EndsWith(phoneDigits))
            ), cancellationToken);

        if (user == null)
        {
            return NotFound(new { message = "No registered account found with this mobile number. Please register first." });
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenService.GenerateToken(user);
        var userDto = MapToDto(user);

        return Ok(new AuthResponseDto(
            Token: token,
            User: userDto,
            RequiresPhoneVerification: false,
            TempToken: null
        ));
    }

    /// <summary>
    /// Initiate password reset via mobile OTP or email
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ForgotPasswordResponseDto>> ForgotPassword([FromBody] ForgotPasswordRequestDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Identifier))
        {
            return BadRequest(new { message = "Email address or mobile number is required." });
        }

        var identifier = dto.Identifier.Trim();
        var normalizedEmail = identifier.ToLowerInvariant();
        var cleanedPhone = identifier.Replace(" ", "").Replace("-", "").Replace("+", "");

        // Find user by email or mobile number
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email.ToLower() == normalizedEmail ||
                (u.PhoneNumber != null && (
                    u.PhoneNumber == identifier ||
                    u.PhoneNumber == "+" + cleanedPhone ||
                    u.PhoneNumber == cleanedPhone ||
                    (cleanedPhone.Length >= 10 && u.PhoneNumber.EndsWith(cleanedPhone))
                )), cancellationToken);

        if (user == null)
        {
            // Return neutral response for security
            return Ok(new ForgotPasswordResponseDto(
                Success: true,
                Message: "If an account matches your details, password recovery instructions have been sent.",
                IsMobile: false,
                PhoneNumber: null,
                ExpirySeconds: 0,
                DevOtp: null
            ));
        }

        // If user has a mobile number, dispatch 6-digit OTP
        if (!string.IsNullOrWhiteSpace(user.PhoneNumber))
        {
            var (otpSuccess, otpMsg, otpCode) = await _otpService.GenerateAndSendOtpAsync(user.PhoneNumber, "PasswordReset", cancellationToken);
            var devOtp = _env.IsDevelopment() ? otpCode : null;

            return Ok(new ForgotPasswordResponseDto(
                Success: true,
                Message: $"A 6-digit verification code has been dispatched to {user.PhoneNumber}.",
                IsMobile: true,
                PhoneNumber: user.PhoneNumber,
                ExpirySeconds: 300,
                DevOtp: devOtp
            ));
        }

        return Ok(new ForgotPasswordResponseDto(
            Success: true,
            Message: $"Password recovery instructions have been dispatched to {user.Email}.",
            IsMobile: false,
            PhoneNumber: null,
            ExpirySeconds: 0,
            DevOtp: null
        ));
    }

    /// <summary>
    /// Verify 6-digit OTP code during password reset flow before revealing password fields
    /// </summary>
    [HttpPost("verify-reset-otp")]
    public async Task<ActionResult<VerifyResetOtpResponseDto>> VerifyResetOtp([FromBody] VerifyResetOtpRequestDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Identifier) || string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            return BadRequest(new { message = "Mobile number or email, and OTP code are required." });
        }

        var identifier = dto.Identifier.Trim();
        var normalizedEmail = identifier.ToLowerInvariant();
        var cleanedPhone = identifier.Replace(" ", "").Replace("-", "").Replace("+", "");

        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email.ToLower() == normalizedEmail ||
                (u.PhoneNumber != null && (
                    u.PhoneNumber == identifier ||
                    u.PhoneNumber == "+" + cleanedPhone ||
                    u.PhoneNumber == cleanedPhone ||
                    (cleanedPhone.Length >= 10 && u.PhoneNumber.EndsWith(cleanedPhone))
                )), cancellationToken);

        if (user == null || string.IsNullOrWhiteSpace(user.PhoneNumber))
        {
            return NotFound(new { message = "No account found matching this identifier." });
        }

        // Verify OTP for user's phone number
        var otpValid = await _otpService.VerifyOtpAsync(user.PhoneNumber, dto.OtpCode, null, cancellationToken);
        if (!otpValid)
        {
            return BadRequest(new { message = "Incorrect OTP code. Please check the 6-digit code sent to your mobile device and try again." });
        }

        // Generate secure signed resetToken valid for 15 minutes
        var resetToken = _jwtTokenService.GenerateResetPasswordToken(user.PhoneNumber, user.Email);

        return Ok(new VerifyResetOtpResponseDto(
            Success: true,
            Message: "Mobile number verified successfully. You may now set your new password.",
            ResetToken: resetToken
        ));
    }

    /// <summary>
    /// Complete password reset with either verified resetToken OR (identifier + otpCode) and new password
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequestDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            return BadRequest(new { message = "New password is required." });
        }

        if (dto.NewPassword.Length < 6)
        {
            return BadRequest(new { message = "New password must be at least 6 characters in length." });
        }

        User? user = null;

        if (!string.IsNullOrWhiteSpace(dto.ResetToken))
        {
            var (valid, phone, email) = _jwtTokenService.ValidateResetPasswordToken(dto.ResetToken);
            if (!valid || (string.IsNullOrEmpty(phone) && string.IsNullOrEmpty(email)))
            {
                return BadRequest(new { message = "Password reset session has expired or is invalid. Please verify your OTP again." });
            }

            user = await _context.Users.FirstOrDefaultAsync(u =>
                (phone != null && u.PhoneNumber == phone) ||
                (email != null && u.Email.ToLower() == email.ToLower()), cancellationToken);
        }
        else if (!string.IsNullOrWhiteSpace(dto.Identifier) && !string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            var identifier = dto.Identifier.Trim();
            var normalizedEmail = identifier.ToLowerInvariant();
            var cleanedPhone = identifier.Replace(" ", "").Replace("-", "").Replace("+", "");

            user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email.ToLower() == normalizedEmail ||
                    (u.PhoneNumber != null && (
                        u.PhoneNumber == identifier ||
                        u.PhoneNumber == "+" + cleanedPhone ||
                        u.PhoneNumber == cleanedPhone ||
                        (cleanedPhone.Length >= 10 && u.PhoneNumber.EndsWith(cleanedPhone))
                    )), cancellationToken);

            if (user == null || string.IsNullOrWhiteSpace(user.PhoneNumber))
            {
                return NotFound(new { message = "No account found matching this identifier." });
            }

            var otpValid = await _otpService.VerifyOtpAsync(user.PhoneNumber, dto.OtpCode, null, cancellationToken);
            if (!otpValid)
            {
                return BadRequest(new { message = "Invalid or expired OTP verification code." });
            }
        }
        else
        {
            return BadRequest(new { message = "Verification token or OTP code is required to reset password." });
        }

        if (user == null)
        {
            return NotFound(new { message = "No account found matching this request." });
        }

        // Update password
        user.PasswordHash = _passwordHasher.HashPassword(dto.NewPassword);
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new { success = true, message = "Your password has been reset successfully. You may now sign in." });
    }

    /// <summary>
    /// Google OAuth sign-in. Verifies Google token, and triggers mobile OTP if phone is unverified
    /// </summary>
    [HttpPost("google-login")]
    public async Task<ActionResult<AuthResponseDto>> GoogleLogin([FromBody] GoogleLoginRequestDto dto, CancellationToken cancellationToken)
    {
        var (valid, googleId, email, firstName, lastName, picture) = await _googleAuthService.ValidateGoogleTokenAsync(dto.Credential, cancellationToken);
        if (!valid || string.IsNullOrEmpty(email))
        {
            return BadRequest(new { message = "Google authentication failed or invalid token." });
        }

        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail || (googleId != null && u.GoogleId == googleId), cancellationToken);

        // If user already exists AND has a verified phone number, log them in directly
        if (user != null && user.IsPhoneVerified && !string.IsNullOrWhiteSpace(user.PhoneNumber))
        {
            if (string.IsNullOrEmpty(user.GoogleId) && !string.IsNullOrEmpty(googleId))
            {
                user.GoogleId = googleId;
            }

            user.LastLoginAtUtc = DateTime.UtcNow;
            user.UpdatedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);

            var token = _jwtTokenService.GenerateToken(user);
            return Ok(new AuthResponseDto(
                Token: token,
                User: MapToDto(user),
                RequiresPhoneVerification: false,
                TempToken: null
            ));
        }

        // Otherwise, phone verification is required. Generate secure temporary token
        var tempToken = _jwtTokenService.GenerateTempToken(normalizedEmail, firstName, lastName, googleId);

        return Ok(new AuthResponseDto(
            Token: null,
            User: null,
            RequiresPhoneVerification: true,
            TempToken: tempToken,
            Email: normalizedEmail,
            FirstName: firstName,
            LastName: lastName
        ));
    }

    /// <summary>
    /// Send OTP to user's mobile number
    /// </summary>
    [HttpPost("send-otp")]
    public async Task<ActionResult<SendOtpResponseDto>> SendOtp([FromBody] SendOtpRequestDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.PhoneNumber))
        {
            return BadRequest(new { message = "Phone number is required." });
        }

        var (success, message, otpCode) = await _otpService.GenerateAndSendOtpAsync(dto.PhoneNumber, dto.TempToken, cancellationToken);
        if (!success)
        {
            return BadRequest(new { message });
        }

        // In Development, expose DevOtp for effortless zero-SMS testing
        var devOtp = _env.IsDevelopment() ? otpCode : null;

        return Ok(new SendOtpResponseDto(
            Success: true,
            Message: message,
            ExpirySeconds: 300,
            DevOtp: devOtp
        ));
    }

    /// <summary>
    /// Verify OTP code and finalize Google user profile with verified mobile number
    /// </summary>
    [HttpPost("verify-google-phone")]
    public async Task<ActionResult<AuthResponseDto>> VerifyGooglePhone([FromBody] VerifyGooglePhoneDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.TempToken) || string.IsNullOrWhiteSpace(dto.PhoneNumber) || string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            return BadRequest(new { message = "Temp token, phone number, and OTP code are required." });
        }

        // 1. Validate temp token
        var (tokenValid, email, firstName, lastName, googleId) = _jwtTokenService.ValidateTempToken(dto.TempToken);
        if (!tokenValid || string.IsNullOrEmpty(email))
        {
            return Unauthorized(new { message = "Temporary session expired. Please sign in with Google again." });
        }

        // 2. Validate OTP code
        var otpValid = await _otpService.VerifyOtpAsync(dto.PhoneNumber, dto.OtpCode, dto.TempToken, cancellationToken);
        if (!otpValid)
        {
            return BadRequest(new { message = "Invalid or expired 6-digit OTP code." });
        }

        var normalizedEmail = email.Trim().ToLowerInvariant();
        var cleanedPhone = dto.PhoneNumber.Replace(" ", "").Replace("-", "").Trim();

        // 3. Find or create user
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (user == null)
        {
            user = new User
            {
                Email = normalizedEmail,
                FirstName = string.IsNullOrWhiteSpace(firstName) ? "Patron" : firstName,
                LastName = string.IsNullOrWhiteSpace(lastName) ? string.Empty : lastName,
                PhoneNumber = cleanedPhone,
                IsPhoneVerified = true,
                GoogleId = googleId,
                Tier = "Velessa Circle",
                Role = "Customer",
                CreatedAtUtc = DateTime.UtcNow
            };
            _context.Users.Add(user);
        }
        else
        {
            user.PhoneNumber = cleanedPhone;
            user.IsPhoneVerified = true;
            if (!string.IsNullOrEmpty(googleId))
            {
                user.GoogleId = googleId;
            }
            if (!string.IsNullOrWhiteSpace(firstName))
            {
                user.FirstName = firstName;
            }
            if (!string.IsNullOrWhiteSpace(lastName))
            {
                user.LastName = lastName;
            }
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        user.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        // 4. Issue full authentication token
        var token = _jwtTokenService.GenerateToken(user);
        var userDto = MapToDto(user);

        return Ok(new AuthResponseDto(
            Token: token,
            User: userDto,
            RequiresPhoneVerification: false,
            TempToken: null
        ));
    }

    /// <summary>
    /// Retrieve currently authenticated user profile
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetCurrentUser(CancellationToken cancellationToken)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(MapToDto(user));
    }

    /// <summary>
    /// Update patron profile (Name and Mobile Number).
    /// Changing mobile number strictly requires 6-digit OTP verification.
    /// </summary>
    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileRequestDto dto, CancellationToken cancellationToken)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName))
        {
            return BadRequest(new { message = "First name and last name cannot be empty." });
        }

        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        var cleanedNewPhone = string.IsNullOrWhiteSpace(dto.PhoneNumber)
            ? null
            : dto.PhoneNumber.Replace(" ", "").Replace("-", "").Trim();

        var currentPhone = user.PhoneNumber?.Replace(" ", "").Replace("-", "").Trim();

        // If phone number is being added or changed
        if (!string.IsNullOrEmpty(cleanedNewPhone) && cleanedNewPhone != currentPhone)
        {
            // 1. Check if new phone number is already taken by another account
            var phoneDigits = cleanedNewPhone.Replace("+", "");
            var phoneTaken = await _context.Users
                .AnyAsync(u => u.Id != user.Id && u.PhoneNumber != null && (
                    u.PhoneNumber == cleanedNewPhone ||
                    u.PhoneNumber == "+" + phoneDigits ||
                    u.PhoneNumber == phoneDigits ||
                    (phoneDigits.Length >= 10 && u.PhoneNumber.EndsWith(phoneDigits))
                ), cancellationToken);

            if (phoneTaken)
            {
                return Conflict(new { message = "This mobile number is already registered to another account." });
            }

            // 2. Validate mandatory OTP verification code
            if (string.IsNullOrWhiteSpace(dto.OtpCode))
            {
                return BadRequest(new { message = "OTP verification code is required to verify your new mobile number." });
            }

            var otpValid = await _otpService.VerifyOtpAsync(cleanedNewPhone, dto.OtpCode, null, cancellationToken);
            if (!otpValid)
            {
                return BadRequest(new { message = "Invalid or expired OTP verification code for your new mobile number." });
            }

            user.PhoneNumber = cleanedNewPhone;
            user.IsPhoneVerified = true;
        }

        user.FirstName = dto.FirstName.Trim();
        user.LastName = dto.LastName.Trim();
        user.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Ok(MapToDto(user));
    }

    /// <summary>
    /// Verify mobile number via OTP during checkout, auto-registering or authenticating the patron seamlessly.
    /// </summary>
    [HttpPost("checkout-verify-phone")]
    public async Task<ActionResult<AuthResponseDto>> CheckoutVerifyPhone([FromBody] CheckoutVerifyPhoneDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.PhoneNumber) || string.IsNullOrWhiteSpace(dto.OtpCode))
        {
            return BadRequest(new { message = "Mobile number and 6-digit OTP code are required." });
        }

        var cleanedPhone = dto.PhoneNumber.Replace(" ", "").Replace("-", "").Trim();
        var otpValid = await _otpService.VerifyOtpAsync(cleanedPhone, dto.OtpCode, null, cancellationToken);
        if (!otpValid)
        {
            return BadRequest(new { message = "Invalid or expired OTP verification code. Please check your SMS or use the dev code." });
        }

        var normalizedEmail = string.IsNullOrWhiteSpace(dto.Email) ? string.Empty : dto.Email.Trim().ToLowerInvariant();
        var phoneDigits = cleanedPhone.Replace("+", "");

        // Find user by phone OR email
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                (u.PhoneNumber != null && (
                    u.PhoneNumber == cleanedPhone ||
                    u.PhoneNumber == "+" + phoneDigits ||
                    u.PhoneNumber == phoneDigits ||
                    (phoneDigits.Length >= 10 && u.PhoneNumber.EndsWith(phoneDigits))
                )) ||
                (!string.IsNullOrEmpty(normalizedEmail) && u.Email.ToLower() == normalizedEmail),
                cancellationToken);

        if (user == null)
        {
            user = new User
            {
                Email = string.IsNullOrWhiteSpace(normalizedEmail) ? $"patron_{cleanedPhone}@velessa.com" : normalizedEmail,
                FirstName = string.IsNullOrWhiteSpace(dto.FirstName) ? "Valued" : dto.FirstName.Trim(),
                LastName = string.IsNullOrWhiteSpace(dto.LastName) ? "Patron" : dto.LastName.Trim(),
                PhoneNumber = cleanedPhone,
                IsPhoneVerified = true,
                Tier = "Velessa Circle",
                Role = "Customer",
                CreatedAtUtc = DateTime.UtcNow,
                LastLoginAtUtc = DateTime.UtcNow
            };
            _context.Users.Add(user);
        }
        else
        {
            user.PhoneNumber = cleanedPhone;
            user.IsPhoneVerified = true;
            if (!string.IsNullOrWhiteSpace(dto.FirstName) && (string.IsNullOrWhiteSpace(user.FirstName) || user.FirstName == "Patron" || user.FirstName == "Valued"))
            {
                user.FirstName = dto.FirstName.Trim();
            }
            if (!string.IsNullOrWhiteSpace(dto.LastName) && string.IsNullOrWhiteSpace(user.LastName))
            {
                user.LastName = dto.LastName.Trim();
            }
            if (!string.IsNullOrWhiteSpace(normalizedEmail) && (string.IsNullOrWhiteSpace(user.Email) || user.Email.Contains("@velessa.com")))
            {
                user.Email = normalizedEmail;
            }
            user.LastLoginAtUtc = DateTime.UtcNow;
            user.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtTokenService.GenerateToken(user);
        var userDto = MapToDto(user);

        return Ok(new AuthResponseDto(
            Token: token,
            User: userDto,
            RequiresPhoneVerification: false,
            TempToken: null
        ));
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto(
            Id: user.Id,
            Email: user.Email,
            FirstName: user.FirstName,
            LastName: user.LastName,
            PhoneNumber: user.PhoneNumber,
            IsPhoneVerified: user.IsPhoneVerified,
            AvatarUrl: user.AvatarUrl,
            Tier: user.Tier,
            MemberSince: user.CreatedAtUtc.Year.ToString(),
            Role: user.Role,
            LastLoginAtUtc: user.LastLoginAtUtc
        );
    }
}
