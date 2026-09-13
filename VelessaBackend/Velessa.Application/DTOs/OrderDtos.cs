using System;
using System.Collections.Generic;

namespace Velessa.Application.DTOs;

public record CreateOrderItemDto(
    int? ProductId,
    string ProductName,
    string? ProductSku,
    decimal UnitPrice,
    int Quantity,
    decimal TotalPrice,
    string? SelectedSize
);

public record CreateOrderDto(
    int? UserId,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    string ShippingAddress,
    string City,
    string? State,
    string PostalCode,
    string? Country,
    decimal SubTotal,
    decimal ShippingFee,
    decimal TotalAmount,
    string? PaymentMethod,
    string? DeliveryMethodName,
    List<CreateOrderItemDto> Items
);

public record OrderItemDto(
    int Id,
    int? ProductId,
    string ProductName,
    string ProductSku,
    decimal UnitPrice,
    int Quantity,
    decimal TotalPrice
);

public record OrderResponseDto(
    int Id,
    string OrderNumber,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    string ShippingAddress,
    string City,
    string PostalCode,
    string Country,
    decimal SubTotal,
    decimal ShippingFee,
    decimal TotalAmount,
    string Status,
    string PaymentStatus,
    string? PaymentTransactionId,
    DateTime CreatedAtUtc,
    List<OrderItemDto> Items
);

public record UpdateOrderStatusDto(
    string Status,
    string? TrackingNumber
);
