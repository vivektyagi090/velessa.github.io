using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Velessa.Domain.Entities;
using Velessa.Domain.Enums;

namespace Velessa.Infrastructure.Persistence;

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;

    public ApplicationDbContextInitialiser(
        ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            if (_context.Database.IsSqlServer())
            {
                await _context.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // 1. Seed Categories if none exist
        if (!await _context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new Category
                {
                    Name = "1 Gram Gold Forming",
                    Slug = "1-gram-gold-forming",
                    Description = "24K Micro Gold Plated heirloom jewelry with high-luster finish indistinguishable from solid gold.",
                    ImageUrl = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 1
                },
                new Category
                {
                    Name = "Royal Kundan Sets",
                    Slug = "royal-kundan-sets",
                    Description = "Exquisite handcrafted Meenakari and Jadau Kundan bridal chokers and necklace sets.",
                    ImageUrl = "https://images.unsplash.com/photo-1611591475819-79b8b730ab8c?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 2
                },
                new Category
                {
                    Name = "American Diamond (CZ)",
                    Slug = "american-diamond-cz",
                    Description = "VVS-grade simulated diamonds set in sterling silver and platinum-rhodium finish.",
                    ImageUrl = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 3
                },
                new Category
                {
                    Name = "Temple & Heritage Heirlooms",
                    Slug = "temple-heritage-heirlooms",
                    Description = "Traditional South Indian antique nagas work and temple jewelry inspired by royal dynasties.",
                    ImageUrl = "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = 4
                }
            };

            await _context.Categories.AddRangeAsync(categories);
            await _context.SaveChangesAsync();
        }

        // 2. Seed Products if none exist
        if (!await _context.Products.AnyAsync())
        {
            var goldCategory = await _context.Categories.FirstAsync(c => c.Slug == "1-gram-gold-forming");
            var kundanCategory = await _context.Categories.FirstAsync(c => c.Slug == "royal-kundan-sets");
            var adCategory = await _context.Categories.FirstAsync(c => c.Slug == "american-diamond-cz");

            var products = new List<Product>
            {
                new Product
                {
                    Name = "Velessa Royal Rajwada 1-Gram Gold Choker",
                    Slug = "velessa-royal-rajwada-1-gram-gold-choker",
                    Sku = "VEL-GLD-001",
                    ShortDescription = "Handcrafted 1 Gram Gold Forming choker necklace with matching jhumkas.",
                    Description = "Crafted with 24 Karat gold micro-forming over premium copper alloy. Features anti-tarnish protective lacquer ensuring enduring luster and brilliance.",
                    BasePrice = 14999.00m,
                    DiscountPrice = 11999.00m,
                    CategoryId = goldCategory.Id,
                    MetalType = MetalType.GoldForming1Gram,
                    Purity = "24K Forming",
                    GrossWeightGrams = 85.5m,
                    NetWeightGrams = 78.0m,
                    InStock = true,
                    StockQuantity = 15,
                    IsFeatured = true,
                    Images = new List<ProductImage>
                    {
                        new ProductImage
                        {
                            ImageUrl = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80",
                            AltText = "Velessa Royal Rajwada Gold Choker",
                            IsPrimary = true,
                            DisplayOrder = 1
                        }
                    }
                },
                new Product
                {
                    Name = "Noor-E-Kundan Heritage Bridal Haar",
                    Slug = "noor-e-kundan-heritage-bridal-haar",
                    Sku = "VEL-KDN-002",
                    ShortDescription = "Jadau Kundan necklace embedded with semi-precious emerald drops and natural pearls.",
                    Description = "Masterfully set by traditional Rajasthani karigars. Features reverse Meenakari enameling and double-string cultured pearl tassels.",
                    BasePrice = 24500.00m,
                    DiscountPrice = 19999.00m,
                    CategoryId = kundanCategory.Id,
                    MetalType = MetalType.RoyalKundan,
                    Purity = "Antique Gold Finish",
                    GrossWeightGrams = 120.0m,
                    NetWeightGrams = 95.0m,
                    InStock = true,
                    StockQuantity = 8,
                    IsFeatured = true,
                    Images = new List<ProductImage>
                    {
                        new ProductImage
                        {
                            ImageUrl = "https://images.unsplash.com/photo-1611591475819-79b8b730ab8c?auto=format&fit=crop&w=1000&q=80",
                            AltText = "Noor-E-Kundan Bridal Haar",
                            IsPrimary = true,
                            DisplayOrder = 1
                        }
                    }
                },
                new Product
                {
                    Name = "Celestial Solitaire American Diamond Tennis Necklace",
                    Slug = "celestial-solitaire-american-diamond-tennis-necklace",
                    Sku = "VEL-DIA-003",
                    ShortDescription = "Hearts & Arrows cut cubic zirconia tennis necklace in 950 Platinum Rhodium plating.",
                    Description = "Indistinguishable from D-Flawless natural diamonds. Micro-prong setting ensures maximum light refractions from every angle.",
                    BasePrice = 18500.00m,
                    DiscountPrice = 14500.00m,
                    CategoryId = adCategory.Id,
                    MetalType = MetalType.AmericanDiamond,
                    Purity = "Platinum Rhodium Plated",
                    GrossWeightGrams = 42.0m,
                    NetWeightGrams = 38.0m,
                    InStock = true,
                    StockQuantity = 20,
                    IsFeatured = true,
                    Images = new List<ProductImage>
                    {
                        new ProductImage
                        {
                            ImageUrl = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
                            AltText = "Celestial Solitaire American Diamond Necklace",
                            IsPrimary = true,
                            DisplayOrder = 1
                        }
                    }
                }
            };

            await _context.Products.AddRangeAsync(products);
            await _context.SaveChangesAsync();
        }

        // 3. Seed Default Shopkeeper / Merchant User if none exists
        if (!await _context.Users.AnyAsync(u => u.Email == "admin@velessa.com" || u.Role == "Shopkeeper"))
        {
            var hasher = new Velessa.Infrastructure.Services.PasswordHasher();
            var adminUser = new User
            {
                Email = "admin@velessa.com",
                FirstName = "Rajesh",
                LastName = "Mehta",
                PhoneNumber = "9820098200",
                IsPhoneVerified = true,
                PasswordHash = hasher.HashPassword("Velessa@2026"),
                Tier = "Haute Joaillerie VIP",
                Role = "Shopkeeper",
                CreatedAtUtc = DateTime.UtcNow,
                LastLoginAtUtc = DateTime.UtcNow
            };
            await _context.Users.AddAsync(adminUser);
            await _context.SaveChangesAsync();
        }
    }
}
