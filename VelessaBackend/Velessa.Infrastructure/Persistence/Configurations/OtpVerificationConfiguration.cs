using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Velessa.Domain.Entities;

namespace Velessa.Infrastructure.Persistence.Configurations;

public class OtpVerificationConfiguration : IEntityTypeConfiguration<OtpVerification>
{
    public void Configure(EntityTypeBuilder<OtpVerification> builder)
    {
        builder.ToTable("OtpVerifications");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.PhoneNumber)
            .IsRequired()
            .HasMaxLength(30);

        builder.HasIndex(o => o.PhoneNumber);

        builder.Property(o => o.OtpCode)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(o => o.Purpose)
            .HasMaxLength(50);

        builder.Property(o => o.TempIdentifier)
            .HasMaxLength(500);

        builder.HasIndex(o => o.TempIdentifier);
    }
}
