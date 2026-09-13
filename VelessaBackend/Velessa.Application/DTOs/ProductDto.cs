using Velessa.Domain.Enums;

namespace Velessa.Application.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public MetalType MetalType { get; set; }
    public string? Purity { get; set; }
    public decimal? GrossWeightGrams { get; set; }
    public decimal? NetWeightGrams { get; set; }
    public bool InStock { get; set; }
    public int StockQuantity { get; set; }
    public bool IsFeatured { get; set; }
    public string? PrimaryImageUrl { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public MetalType MetalType { get; set; } = MetalType.GoldForming1Gram;
    public string? Purity { get; set; }
    public decimal? GrossWeightGrams { get; set; }
    public decimal? NetWeightGrams { get; set; }
    public bool InStock { get; set; } = true;
    public int StockQuantity { get; set; } = 10;
    public bool IsFeatured { get; set; } = false;
    public List<string> ImageUrls { get; set; } = new();
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public MetalType MetalType { get; set; } = MetalType.GoldForming1Gram;
    public string? Purity { get; set; }
    public decimal? GrossWeightGrams { get; set; }
    public decimal? NetWeightGrams { get; set; }
    public bool InStock { get; set; } = true;
    public int StockQuantity { get; set; } = 10;
    public bool IsFeatured { get; set; } = false;
    public List<string> ImageUrls { get; set; } = new();
}

public class UpdateStockDto
{
    public int StockQuantity { get; set; }
    public bool InStock { get; set; } = true;
}
