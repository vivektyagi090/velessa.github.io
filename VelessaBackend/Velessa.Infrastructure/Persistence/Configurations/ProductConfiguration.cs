using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Velessa.Domain.Entities;

namespace Velessa.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(p => p.Slug)
            .IsRequired()
            .HasMaxLength(280);

        builder.HasIndex(p => p.Slug)
            .IsUnique();

        builder.Property(p => p.Sku)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(p => p.Sku)
            .IsUnique();

        builder.Property(p => p.ShortDescription)
            .HasMaxLength(500);

        builder.Property(p => p.Description)
            .HasMaxLength(4000);

        builder.Property(p => p.BasePrice)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.DiscountPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.GrossWeightGrams)
            .HasColumnType("decimal(8,3)");

        builder.Property(p => p.NetWeightGrams)
            .HasColumnType("decimal(8,3)");

        builder.Property(p => p.Purity)
            .HasMaxLength(50);

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Images)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
