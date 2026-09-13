using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Velessa.Application.Common.Interfaces;
using Velessa.Application.DTOs;
using Velessa.Domain.Entities;
using Velessa.Domain.Enums;

namespace Velessa.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private const string AllProductsCacheKey = "Velessa_All_Products_Cache";

    public ProductsController(IApplicationDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] int? categoryId,
        [FromQuery] MetalType? metalType,
        [FromQuery] bool? isFeatured,
        [FromQuery] string? search,
        [FromQuery] string? sort)
    {
        bool isDefaultList = !categoryId.HasValue && !metalType.HasValue && !isFeatured.HasValue 
                             && string.IsNullOrWhiteSpace(search) && string.IsNullOrWhiteSpace(sort);

        if (isDefaultList && _cache.TryGetValue(AllProductsCacheKey, out List<ProductDto>? cachedProducts) && cachedProducts != null)
        {
            return Ok(cachedProducts);
        }

        var query = _context.Products
            .AsNoTracking()
            .Where(p => p.IsActive)
            .AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (metalType.HasValue)
        {
            query = query.Where(p => p.MetalType == metalType.Value);
        }

        if (isFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == isFeatured.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(term) || p.Description.ToLower().Contains(term));
        }

        query = sort?.ToLower() switch
        {
            "price_asc" => query.OrderBy(p => p.DiscountPrice ?? p.BasePrice),
            "price_desc" => query.OrderByDescending(p => p.DiscountPrice ?? p.BasePrice),
            "newest" => query.OrderByDescending(p => p.CreatedAtUtc),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.Id)
        };

        var rawProducts = await query.Select(p => new
        {
            p.Id,
            p.Name,
            p.Slug,
            p.Sku,
            p.ShortDescription,
            p.Description,
            p.BasePrice,
            p.DiscountPrice,
            p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : null,
            p.MetalType,
            p.Purity,
            p.GrossWeightGrams,
            p.NetWeightGrams,
            p.InStock,
            p.StockQuantity,
            p.IsFeatured,
            Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                AltText = i.AltText,
                IsPrimary = i.IsPrimary,
                DisplayOrder = i.DisplayOrder
            }).ToList()
        }).ToListAsync();

        var products = rawProducts.Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            Sku = p.Sku,
            ShortDescription = p.ShortDescription,
            Description = p.Description,
            BasePrice = p.BasePrice,
            DiscountPrice = p.DiscountPrice,
            CategoryId = p.CategoryId,
            CategoryName = p.CategoryName,
            MetalType = p.MetalType,
            Purity = p.Purity,
            GrossWeightGrams = p.GrossWeightGrams,
            NetWeightGrams = p.NetWeightGrams,
            InStock = p.InStock,
            StockQuantity = p.StockQuantity,
            IsFeatured = p.IsFeatured,
            PrimaryImageUrl = p.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? p.Images.FirstOrDefault()?.ImageUrl,
            Images = p.Images
        }).ToList();

        if (isDefaultList)
        {
            _cache.Set(AllProductsCacheKey, products, TimeSpan.FromMinutes(10));
        }

        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProductById(int id)
    {
        var cacheKey = $"Product_Id_{id}";
        if (_cache.TryGetValue(cacheKey, out ProductDto? cached) && cached != null)
        {
            return Ok(cached);
        }

        var raw = await _context.Products
            .AsNoTracking()
            .Where(p => p.Id == id && p.IsActive)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Slug,
                p.Sku,
                p.ShortDescription,
                p.Description,
                p.BasePrice,
                p.DiscountPrice,
                p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : null,
                p.MetalType,
                p.Purity,
                p.GrossWeightGrams,
                p.NetWeightGrams,
                p.InStock,
                p.StockQuantity,
                p.IsFeatured,
                Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    AltText = i.AltText,
                    IsPrimary = i.IsPrimary,
                    DisplayOrder = i.DisplayOrder
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (raw == null)
            return NotFound();

        var product = new ProductDto
        {
            Id = raw.Id,
            Name = raw.Name,
            Slug = raw.Slug,
            Sku = raw.Sku,
            ShortDescription = raw.ShortDescription,
            Description = raw.Description,
            BasePrice = raw.BasePrice,
            DiscountPrice = raw.DiscountPrice,
            CategoryId = raw.CategoryId,
            CategoryName = raw.CategoryName,
            MetalType = raw.MetalType,
            Purity = raw.Purity,
            GrossWeightGrams = raw.GrossWeightGrams,
            NetWeightGrams = raw.NetWeightGrams,
            InStock = raw.InStock,
            StockQuantity = raw.StockQuantity,
            IsFeatured = raw.IsFeatured,
            PrimaryImageUrl = raw.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? raw.Images.FirstOrDefault()?.ImageUrl,
            Images = raw.Images
        };

        _cache.Set(cacheKey, product, TimeSpan.FromMinutes(10));
        return Ok(product);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ProductDto>> GetProductBySlug(string slug)
    {
        var cacheKey = $"Product_Slug_{slug.ToLower()}";
        if (_cache.TryGetValue(cacheKey, out ProductDto? cached) && cached != null)
        {
            return Ok(cached);
        }

        var raw = await _context.Products
            .AsNoTracking()
            .Where(p => p.Slug == slug && p.IsActive)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Slug,
                p.Sku,
                p.ShortDescription,
                p.Description,
                p.BasePrice,
                p.DiscountPrice,
                p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : null,
                p.MetalType,
                p.Purity,
                p.GrossWeightGrams,
                p.NetWeightGrams,
                p.InStock,
                p.StockQuantity,
                p.IsFeatured,
                Images = p.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    AltText = i.AltText,
                    IsPrimary = i.IsPrimary,
                    DisplayOrder = i.DisplayOrder
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (raw == null)
            return NotFound();

        var product = new ProductDto
        {
            Id = raw.Id,
            Name = raw.Name,
            Slug = raw.Slug,
            Sku = raw.Sku,
            ShortDescription = raw.ShortDescription,
            Description = raw.Description,
            BasePrice = raw.BasePrice,
            DiscountPrice = raw.DiscountPrice,
            CategoryId = raw.CategoryId,
            CategoryName = raw.CategoryName,
            MetalType = raw.MetalType,
            Purity = raw.Purity,
            GrossWeightGrams = raw.GrossWeightGrams,
            NetWeightGrams = raw.NetWeightGrams,
            InStock = raw.InStock,
            StockQuantity = raw.StockQuantity,
            IsFeatured = raw.IsFeatured,
            PrimaryImageUrl = raw.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? raw.Images.FirstOrDefault()?.ImageUrl,
            Images = raw.Images
        };

        _cache.Set(cacheKey, product, TimeSpan.FromMinutes(10));
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto dto)
    {
        var slug = dto.Name.ToLower().Replace(" ", "-").Replace("'", "");
        if (await _context.Products.AnyAsync(p => p.Slug == slug))
        {
            slug = $"{slug}-{new Random().Next(100, 999)}";
        }

        if (await _context.Products.AnyAsync(p => p.Sku == dto.Sku))
        {
            dto.Sku = $"{dto.Sku}-{new Random().Next(100, 999)}";
        }

        Category? category = null;
        if (!string.IsNullOrWhiteSpace(dto.CategoryName))
        {
            var cleanCatName = dto.CategoryName.Trim();
            category = await _context.Categories.FirstOrDefaultAsync(c => c.Name.ToLower() == cleanCatName.ToLower());
            if (category == null)
            {
                var catSlug = cleanCatName.ToLower().Replace(" ", "-").Replace("&", "and").Replace("'", "");
                category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == catSlug);
            }
            if (category == null)
            {
                var catSlug = cleanCatName.ToLower().Replace(" ", "-").Replace("&", "and").Replace("'", "");
                category = new Category
                {
                    Name = cleanCatName,
                    Slug = catSlug,
                    Description = $"Velessa {cleanCatName} Jewellery Collection",
                    ImageUrl = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = await _context.Categories.CountAsync() + 1,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }
        }
        else if (dto.CategoryId > 0)
        {
            category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == dto.CategoryId);
        }

        if (category == null)
        {
            category = await _context.Categories.FirstOrDefaultAsync();
        }

        if (category != null)
        {
            dto.CategoryId = category.Id;
        }

        var product = new Product
        {
            Name = dto.Name,
            Slug = slug,
            Sku = dto.Sku,
            ShortDescription = dto.ShortDescription,
            Description = dto.Description,
            BasePrice = dto.BasePrice,
            DiscountPrice = dto.DiscountPrice,
            CategoryId = dto.CategoryId,
            MetalType = dto.MetalType,
            Purity = dto.Purity,
            GrossWeightGrams = dto.GrossWeightGrams,
            NetWeightGrams = dto.NetWeightGrams,
            InStock = dto.InStock,
            StockQuantity = dto.StockQuantity,
            IsFeatured = dto.IsFeatured
        };

        int order = 1;
        foreach (var imgUrl in dto.ImageUrls)
        {
            product.Images.Add(new ProductImage
            {
                ImageUrl = imgUrl,
                IsPrimary = order == 1,
                DisplayOrder = order++
            });
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        _cache.Remove(AllProductsCacheKey);

        var productDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Sku = product.Sku,
            ShortDescription = product.ShortDescription,
            Description = product.Description,
            BasePrice = product.BasePrice,
            DiscountPrice = product.DiscountPrice,
            CategoryId = product.CategoryId,
            CategoryName = category?.Name,
            MetalType = product.MetalType,
            Purity = product.Purity,
            GrossWeightGrams = product.GrossWeightGrams,
            NetWeightGrams = product.NetWeightGrams,
            InStock = product.InStock,
            StockQuantity = product.StockQuantity,
            IsFeatured = product.IsFeatured,
            PrimaryImageUrl = product.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? product.Images.FirstOrDefault()?.ImageUrl,
            Images = product.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                AltText = i.AltText,
                IsPrimary = i.IsPrimary,
                DisplayOrder = i.DisplayOrder
            }).ToList()
        };

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, productDto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return NotFound(new { message = $"Product with ID {id} not found." });

        var oldSlug = product.Slug;

        product.Name = dto.Name;
        product.Sku = dto.Sku;
        product.ShortDescription = dto.ShortDescription;
        product.Description = dto.Description;
        product.BasePrice = dto.BasePrice;
        product.DiscountPrice = dto.DiscountPrice;
        product.MetalType = dto.MetalType;
        product.Purity = dto.Purity;
        product.GrossWeightGrams = dto.GrossWeightGrams;
        product.NetWeightGrams = dto.NetWeightGrams;
        product.InStock = dto.InStock;
        product.StockQuantity = dto.StockQuantity;
        product.IsFeatured = dto.IsFeatured;
        product.UpdatedAtUtc = DateTime.UtcNow;

        // Resolve Category: prioritize CategoryName if provided
        Category? category = null;
        if (!string.IsNullOrWhiteSpace(dto.CategoryName))
        {
            var cleanCatName = dto.CategoryName.Trim();
            category = await _context.Categories.FirstOrDefaultAsync(c => c.Name.ToLower() == cleanCatName.ToLower());
            if (category == null)
            {
                var catSlug = cleanCatName.ToLower().Replace(" ", "-").Replace("&", "and").Replace("'", "");
                category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == catSlug);
            }
            if (category == null)
            {
                var catSlug = cleanCatName.ToLower().Replace(" ", "-").Replace("&", "and").Replace("'", "");
                category = new Category
                {
                    Name = cleanCatName,
                    Slug = catSlug,
                    Description = $"Velessa {cleanCatName} Jewellery Collection",
                    ImageUrl = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
                    DisplayOrder = await _context.Categories.CountAsync() + 1,
                    IsActive = true,
                    CreatedAtUtc = DateTime.UtcNow
                };
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            }
        }
        else if (dto.CategoryId > 0)
        {
            category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == dto.CategoryId);
        }

        if (category == null)
        {
            category = product.Category ?? await _context.Categories.FirstOrDefaultAsync();
        }

        if (category != null)
        {
            product.CategoryId = category.Id;
            product.Category = category;
        }

        // Update Slug if name changed or slug empty
        if (string.IsNullOrEmpty(product.Slug) || (!string.IsNullOrEmpty(dto.Name) && !product.Name.Equals(dto.Name, StringComparison.OrdinalIgnoreCase)))
        {
            var baseSlug = dto.Name.ToLower().Replace(" ", "-").Replace("'", "");
            var newSlug = baseSlug;
            if (await _context.Products.AnyAsync(p => p.Slug == newSlug && p.Id != id))
            {
                newSlug = $"{baseSlug}-{new Random().Next(100, 999)}";
            }
            product.Slug = newSlug;
        }

        if (dto.ImageUrls != null && dto.ImageUrls.Any())
        {
            _context.ProductImages.RemoveRange(product.Images);
            product.Images.Clear();
            int order = 1;
            foreach (var imgUrl in dto.ImageUrls)
            {
                product.Images.Add(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = imgUrl,
                    IsPrimary = order == 1,
                    DisplayOrder = order++
                });
            }
        }

        await _context.SaveChangesAsync();

        _cache.Remove(AllProductsCacheKey);
        _cache.Remove($"Product_Id_{id}");
        if (!string.IsNullOrEmpty(oldSlug))
            _cache.Remove($"Product_Slug_{oldSlug.ToLower()}");
        if (!string.IsNullOrEmpty(product.Slug))
            _cache.Remove($"Product_Slug_{product.Slug.ToLower()}");

        var resultDto = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Sku = product.Sku,
            ShortDescription = product.ShortDescription,
            Description = product.Description,
            BasePrice = product.BasePrice,
            DiscountPrice = product.DiscountPrice,
            CategoryId = product.CategoryId,
            CategoryName = category?.Name ?? product.Category?.Name,
            MetalType = product.MetalType,
            Purity = product.Purity,
            GrossWeightGrams = product.GrossWeightGrams,
            NetWeightGrams = product.NetWeightGrams,
            InStock = product.InStock,
            StockQuantity = product.StockQuantity,
            IsFeatured = product.IsFeatured,
            PrimaryImageUrl = product.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl ?? product.Images.FirstOrDefault()?.ImageUrl,
            Images = product.Images.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                AltText = i.AltText,
                IsPrimary = i.IsPrimary,
                DisplayOrder = i.DisplayOrder
            }).ToList()
        };

        return Ok(resultDto);
    }

    [HttpPatch("{id:int}/stock")]
    public async Task<ActionResult> UpdateStock(int id, [FromBody] UpdateStockDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = $"Product with ID {id} not found." });

        product.StockQuantity = dto.StockQuantity;
        product.InStock = dto.InStock && dto.StockQuantity > 0;
        product.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        _cache.Remove(AllProductsCacheKey);
        _cache.Remove($"Product_Id_{id}");
        if (!string.IsNullOrEmpty(product.Slug))
            _cache.Remove($"Product_Slug_{product.Slug.ToLower()}");

        return Ok(new { id = product.Id, stockQuantity = product.StockQuantity, inStock = product.InStock });
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = $"Product with ID {id} not found." });

        product.IsActive = false;
        product.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        _cache.Remove(AllProductsCacheKey);
        _cache.Remove($"Product_Id_{id}");
        if (!string.IsNullOrEmpty(product.Slug))
            _cache.Remove($"Product_Slug_{product.Slug.ToLower()}");

        return Ok(new { message = $"Product {product.Name} (ID {id}) deactivated successfully." });
    }
}
