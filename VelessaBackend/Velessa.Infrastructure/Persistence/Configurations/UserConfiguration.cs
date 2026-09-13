using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Velessa.Domain.Entities;

namespace Velessa.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(30);

        builder.HasIndex(u => u.PhoneNumber);

        builder.Property(u => u.GoogleId)
            .HasMaxLength(256);

        builder.HasIndex(u => u.GoogleId);

        builder.Property(u => u.Tier)
            .HasMaxLength(50);

        builder.Property(u => u.Role)
            .HasMaxLength(50);
    }
}
