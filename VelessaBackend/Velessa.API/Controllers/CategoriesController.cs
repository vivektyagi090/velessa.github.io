using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Velessa.Application.Common.Interfaces;
using Velessa.Application.DTOs;

namespace Velessa.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public CategoriesController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _context.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                DisplayOrder = c.DisplayOrder,
                ProductCount = c.Products.Count(p => p.IsActive)
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
    {
        var category = await _context.Categories
            .Where(c => c.Id == id && c.IsActive)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                DisplayOrder = c.DisplayOrder,
                ProductCount = c.Products.Count(p => p.IsActive)
            })
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryBySlug(string slug)
    {
        var category = await _context.Categories
            .Where(c => c.Slug == slug && c.IsActive)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                DisplayOrder = c.DisplayOrder,
                ProductCount = c.Products.Count(p => p.IsActive)
            })
            .FirstOrDefaultAsync();

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { message = "Category name is required" });

        var trimmedName = dto.Name.Trim();
        var slug = trimmedName.ToLower().Replace(" ", "-").Replace("'", "");
        var existing = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug || c.Name.ToLower() == trimmedName.ToLower());
        if (existing != null)
        {
            return Ok(new CategoryDto
            {
                Id = existing.Id,
                Name = existing.Name,
                Slug = existing.Slug,
                Description = existing.Description,
                ImageUrl = existing.ImageUrl,
                DisplayOrder = existing.DisplayOrder
            });
        }

        var cat = new Velessa.Domain.Entities.Category
        {
            Name = trimmedName,
            Slug = slug,
            Description = dto.Description ?? $"Velessa {trimmedName} Collection",
            ImageUrl = dto.ImageUrl ?? "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            DisplayOrder = 10,
            IsActive = true
        };
        _context.Categories.Add(cat);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategoryById), new { id = cat.Id }, new CategoryDto
        {
            Id = cat.Id,
            Name = cat.Name,
            Slug = cat.Slug,
            Description = cat.Description,
            ImageUrl = cat.ImageUrl,
            DisplayOrder = cat.DisplayOrder,
            ProductCount = 0
        });
    }
}
