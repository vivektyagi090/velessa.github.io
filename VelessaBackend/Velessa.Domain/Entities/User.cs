using Velessa.Domain.Common;

namespace Velessa.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public bool IsPhoneVerified { get; set; } = false;
    public string? GoogleId { get; set; }
    public string? AvatarUrl { get; set; }
    public string Tier { get; set; } = "Velessa Circle";
    public string Role { get; set; } = "Customer";
    public DateTime? LastLoginAtUtc { get; set; }
}
