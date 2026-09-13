using Velessa.Domain.Common;
using Velessa.Domain.Enums;

namespace Velessa.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public decimal BasePrice { get; set; }
    public decimal? DiscountPrice { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public MetalType MetalType { get; set; } = MetalType.GoldForming1Gram;
    public string? Purity { get; set; } // e.g. "24K Forming", "18K Solid", "925 Silver"

    public decimal? GrossWeightGrams { get; set; }
    public decimal? NetWeightGrams { get; set; }

    public bool InStock { get; set; } = true;
    public int StockQuantity { get; set; } = 10;
    public bool IsFeatured { get; set; } = false;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}
