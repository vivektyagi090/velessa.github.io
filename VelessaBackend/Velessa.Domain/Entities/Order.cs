using Velessa.Domain.Common;
using Velessa.Domain.Enums;

namespace Velessa.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;

    public string ShippingAddress { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = "India";

    public decimal SubTotal { get; set; }
    public decimal ShippingFee { get; set; } = 0;
    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public string? PaymentTransactionId { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
