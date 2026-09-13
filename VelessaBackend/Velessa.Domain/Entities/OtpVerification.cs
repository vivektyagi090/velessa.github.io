using Velessa.Domain.Common;

namespace Velessa.Domain.Entities;

public class OtpVerification : BaseEntity
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
    public DateTime ExpiryTimeUtc { get; set; }
    public bool IsUsed { get; set; } = false;
    public int Attempts { get; set; } = 0;
    public string Purpose { get; set; } = "GooglePhoneVerification";
    public string? TempIdentifier { get; set; }
}
