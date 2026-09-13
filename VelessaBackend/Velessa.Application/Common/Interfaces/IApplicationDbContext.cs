using Microsoft.EntityFrameworkCore;
using Velessa.Domain.Entities;

namespace Velessa.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<User> Users { get; }
    DbSet<OtpVerification> OtpVerifications { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
