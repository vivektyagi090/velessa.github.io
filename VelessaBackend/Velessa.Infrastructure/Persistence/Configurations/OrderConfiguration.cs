using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Velessa.Domain.Entities;

namespace Velessa.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.Property(o => o.CustomerName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(o => o.CustomerEmail)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(o => o.CustomerPhone)
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(o => o.ShippingAddress)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(o => o.City)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(o => o.PostalCode)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(o => o.Country)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(o => o.SubTotal)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.ShippingFee)
            .HasColumnType("decimal(18,2)");

        builder.Property(o => o.TotalAmount)
            .HasColumnType("decimal(18,2)");

        builder.HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");

        builder.HasKey(oi => oi.Id);

        builder.Property(oi => oi.ProductName)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(oi => oi.ProductSku)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(oi => oi.UnitPrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(oi => oi.TotalPrice)
            .HasColumnType("decimal(18,2)");

        builder.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
