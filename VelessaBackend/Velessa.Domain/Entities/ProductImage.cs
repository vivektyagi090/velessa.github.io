using Velessa.Domain.Common;

namespace Velessa.Domain.Entities;

public class ProductImage : BaseEntity
{
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
}
