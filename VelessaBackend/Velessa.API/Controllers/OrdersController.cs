using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Velessa.Application.Common.Interfaces;
using Velessa.Application.DTOs;
using Velessa.Domain.Entities;
using Velessa.Domain.Enums;

namespace Velessa.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IApplicationDbContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] CreateOrderDto request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            return BadRequest(new { message = "Order payload is required." });
        }

        if (string.IsNullOrWhiteSpace(request.CustomerName) ||
            string.IsNullOrWhiteSpace(request.CustomerEmail) ||
            string.IsNullOrWhiteSpace(request.CustomerPhone) ||
            string.IsNullOrWhiteSpace(request.ShippingAddress) ||
            string.IsNullOrWhiteSpace(request.City))
        {
            return BadRequest(new { message = "All customer name, contact, and shipping address fields are required." });
        }

        if (request.Items == null || !request.Items.Any())
        {
            return BadRequest(new { message = "An order must contain at least one item." });
        }

        // Generate unique order number
        string orderNumber;
        int attempts = 0;
        var random = new Random();
        do
        {
            orderNumber = $"VEL-{random.Next(100000, 999999)}";
            attempts++;
        } while (await _context.Orders.AnyAsync(o => o.OrderNumber == orderNumber, cancellationToken) && attempts < 10);

        string combinedAddress = string.IsNullOrWhiteSpace(request.State)
            ? request.ShippingAddress.Trim()
            : $"{request.ShippingAddress.Trim()}, {request.State.Trim()}";

        if (combinedAddress.Length > 300)
        {
            combinedAddress = combinedAddress.Substring(0, 300);
        }

        string customerPhone = request.CustomerPhone.Trim();
        string customerEmail = request.CustomerEmail.Trim();

        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerName = request.CustomerName.Trim(),
            CustomerEmail = customerEmail,
            CustomerPhone = customerPhone,
            ShippingAddress = combinedAddress,
            City = request.City.Trim(),
            PostalCode = string.IsNullOrWhiteSpace(request.PostalCode) ? "400001" : request.PostalCode.Trim(),
            Country = string.IsNullOrWhiteSpace(request.Country) ? "India" : request.Country.Trim(),
            SubTotal = request.SubTotal > 0 ? request.SubTotal : request.Items.Sum(i => i.TotalPrice),
            ShippingFee = request.ShippingFee >= 0 ? request.ShippingFee : 0,
            TotalAmount = request.TotalAmount > 0 ? request.TotalAmount : request.Items.Sum(i => i.TotalPrice),
            Status = OrderStatus.Confirmed,
            PaymentStatus = PaymentStatus.Paid,
            PaymentTransactionId = $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{random.Next(1000, 9999)}",
            CreatedAtUtc = DateTime.UtcNow,
            IsActive = true
        };

        foreach (var item in request.Items)
        {
            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = string.IsNullOrWhiteSpace(item.ProductName) ? "Fine Jewellery Creation" : item.ProductName.Trim(),
                ProductSku = string.IsNullOrWhiteSpace(item.ProductSku) ? "VLSA-JEWEL" : item.ProductSku.Trim(),
                UnitPrice = item.UnitPrice,
                Quantity = item.Quantity > 0 ? item.Quantity : 1,
                TotalPrice = item.TotalPrice > 0 ? item.TotalPrice : (item.UnitPrice * (item.Quantity > 0 ? item.Quantity : 1)),
                CreatedAtUtc = DateTime.UtcNow,
                IsActive = true
            };

            order.Items.Add(orderItem);
        }

        _context.Orders.Add(order);

        // Optionally associate / verify patron user record if exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u =>
            u.Email.ToLower() == customerEmail.ToLower() ||
            (u.PhoneNumber != null && (u.PhoneNumber == customerPhone || u.PhoneNumber.EndsWith(customerPhone.Length >= 10 ? customerPhone.Substring(customerPhone.Length - 10) : customerPhone))),
            cancellationToken);

        if (existingUser != null)
        {
            existingUser.IsPhoneVerified = true;
            if (string.IsNullOrWhiteSpace(existingUser.PhoneNumber))
            {
                existingUser.PhoneNumber = customerPhone;
            }
            existingUser.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Saved new order {OrderNumber} to SQL Server Orders table with {ItemCount} items.", order.OrderNumber, order.Items.Count);

        var responseDto = MapToResponseDto(order);
        return CreatedAtAction(nameof(GetOrderByIdOrNumber), new { idOrNumber = order.OrderNumber }, responseDto);
    }

    [HttpGet("{idOrNumber}")]
    public async Task<ActionResult<OrderResponseDto>> GetOrderByIdOrNumber(string idOrNumber, CancellationToken cancellationToken)
    {
        Order? order = null;
        if (int.TryParse(idOrNumber, out int id))
        {
            order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }

        if (order == null)
        {
            order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.OrderNumber == idOrNumber, cancellationToken);
        }

        if (order == null)
        {
            return NotFound(new { message = $"Order '{idOrNumber}' was not found in the database." });
        }

        return Ok(MapToResponseDto(order));
    }

    [HttpGet("customer")]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrdersByCustomer(
        [FromQuery] string? email,
        [FromQuery] string? phone,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(phone))
        {
            return BadRequest(new { message = "Please provide an email or phone number to retrieve orders." });
        }

        var query = _context.Orders
            .Include(o => o.Items)
            .AsQueryable();

        string cleanPhone = phone?.Trim().Replace(" ", "").Replace("-", "").Replace("+", "") ?? "";
        string last10Phone = cleanPhone.Length >= 10 ? cleanPhone.Substring(cleanPhone.Length - 10) : cleanPhone;
        string cleanEmail = email?.Trim().ToLower() ?? "";

        var orders = await query
            .Where(o =>
                (!string.IsNullOrEmpty(cleanEmail) && o.CustomerEmail.ToLower() == cleanEmail) ||
                (!string.IsNullOrEmpty(last10Phone) && o.CustomerPhone.Contains(last10Phone)))
            .OrderByDescending(o => o.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(orders.Select(MapToResponseDto));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetAllOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return Ok(orders.Select(MapToResponseDto));
    }

    private static OrderResponseDto MapToResponseDto(Order order)
    {
        return new OrderResponseDto(
            order.Id,
            order.OrderNumber,
            order.CustomerName,
            order.CustomerEmail,
            order.CustomerPhone,
            order.ShippingAddress,
            order.City,
            order.PostalCode,
            order.Country,
            order.SubTotal,
            order.ShippingFee,
            order.TotalAmount,
            order.Status.ToString(),
            order.PaymentStatus.ToString(),
            order.PaymentTransactionId,
            order.CreatedAtUtc,
            order.Items.Select(i => new OrderItemDto(
                i.Id,
                i.ProductId,
                i.ProductName,
                i.ProductSku,
                i.UnitPrice,
                i.Quantity,
                i.TotalPrice
            )).ToList()
        );
    }

    [HttpPatch("{idOrNumber}/status")]
    public async Task<ActionResult> UpdateOrderStatus(string idOrNumber, [FromBody] UpdateOrderStatusDto dto)
    {
        Order? order = null;
        if (int.TryParse(idOrNumber, out int id))
        {
            order = await _context.Orders.FindAsync(id);
        }

        if (order == null)
        {
            order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderNumber == idOrNumber);
        }

        if (order == null)
        {
            return NotFound(new { message = $"Order '{idOrNumber}' not found." });
        }

        if (Enum.TryParse<OrderStatus>(dto.Status, true, out var parsedStatus))
        {
            order.Status = parsedStatus;
        }

        order.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Order status updated successfully", status = order.Status.ToString() });
    }
}
