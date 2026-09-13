using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Velessa.Application.Common.Interfaces;
using Velessa.Domain.Entities;

namespace Velessa.Infrastructure.Services;

public class OtpService : IOtpService
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<OtpService> _logger;

    public OtpService(IApplicationDbContext context, ILogger<OtpService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<(bool Success, string Message, string OtpCode)> GenerateAndSendOtpAsync(
        string phoneNumber,
        string? tempIdentifier,
        CancellationToken cancellationToken = default)
    {
        // Standardize phone number format (remove spaces and dashes)
        var cleanedPhone = phoneNumber.Replace(" ", "").Replace("-", "").Trim();
        if (string.IsNullOrWhiteSpace(cleanedPhone) || cleanedPhone.Length < 7)
        {
            return (false, "Please provide a valid phone number.", string.Empty);
        }

        // Invalidate any existing unused OTPs for this phone number
        var existingOtps = await _context.OtpVerifications
            .Where(o => o.PhoneNumber == cleanedPhone && !o.IsUsed && o.ExpiryTimeUtc > DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        foreach (var existing in existingOtps)
        {
            existing.IsUsed = true;
        }

        // Generate cryptographic 6-digit OTP code (100000 - 999999)
        var otpCode = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

        var otpEntity = new OtpVerification
        {
            PhoneNumber = cleanedPhone,
            OtpCode = otpCode,
            ExpiryTimeUtc = DateTime.UtcNow.AddMinutes(5),
            IsUsed = false,
            Attempts = 0,
            Purpose = "GooglePhoneVerification",
            TempIdentifier = tempIdentifier
        };

        _context.OtpVerifications.Add(otpEntity);
        await _context.SaveChangesAsync(cancellationToken);

        // Simulation / SMS Dispatcher:
        // In local development, we log clearly to the console
        _logger.LogInformation("\n=======================================================\n[VELESSA SECURITY OTP] To: {PhoneNumber}\nVerification Code: {OtpCode}\nValid for: 5 minutes\n=======================================================\n", cleanedPhone, otpCode);

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine($"\n[VELESSA OTP DISPATCH] >>> Verification code for {cleanedPhone} is: {otpCode} (Valid for 5m) <<<\n");
        Console.ResetColor();

        return (true, "A 6-digit verification code has been dispatched to your mobile number.", otpCode);
    }

    public async Task<bool> VerifyOtpAsync(
        string phoneNumber,
        string otpCode,
        string? tempIdentifier,
        CancellationToken cancellationToken = default)
    {
        var cleanedPhone = phoneNumber.Replace(" ", "").Replace("-", "").Trim();
        var trimmedCode = otpCode.Trim();

        var otpRecord = await _context.OtpVerifications
            .Where(o => o.PhoneNumber == cleanedPhone && !o.IsUsed && o.ExpiryTimeUtc > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (otpRecord == null)
        {
            _logger.LogWarning("OTP verification failed: No active OTP record found for phone {PhoneNumber}", cleanedPhone);
            return false;
        }

        otpRecord.Attempts++;

        if (otpRecord.Attempts > 5)
        {
            otpRecord.IsUsed = true;
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogWarning("OTP verification failed: Maximum attempts exceeded for {PhoneNumber}", cleanedPhone);
            return false;
        }

        if (otpRecord.OtpCode != trimmedCode)
        {
            await _context.SaveChangesAsync(cancellationToken);
            _logger.LogWarning("OTP verification failed: Incorrect code entered for {PhoneNumber}", cleanedPhone);
            return false;
        }

        otpRecord.IsUsed = true;
        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("OTP successfully verified for phone {PhoneNumber}", cleanedPhone);
        return true;
    }
}
