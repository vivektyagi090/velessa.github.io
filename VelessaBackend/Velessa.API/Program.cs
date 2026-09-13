using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Velessa.Infrastructure;
using Velessa.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Infrastructure Services (SQL Server DbContext, Auth Services, Initialiser, etc.)
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddMemoryCache();

// 2. Add JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "VelessaHauteJoaillerieMasterEncryptionSecretKey2026!@#$LuxuryPatronKey";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "VelessaAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "VelessaApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});
builder.Services.AddAuthorization();

// 3. Add CORS policy for Vite React Frontend (Supports Localhost, Vercel, Netlify, and Cloudflare)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 4. Add Controllers with JSON String Enum Converter
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 5. Swagger / OpenAPI Documentation with Bearer Security
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Velessa Haute Joaillerie API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 6. Initialise and seed database (resilient to cloud container startups)
try
{
    using var scope = app.Services.CreateScope();
    var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
    await initialiser.InitialiseAsync();
    await initialiser.SeedAsync();
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogWarning(ex, "Database initialisation skipped or deferred: {Message}", ex.Message);
}

// 7. Configure HTTP pipeline (Swagger enabled for API testing on Render/Cloud)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Velessa API v1");
    c.RoutePrefix = "swagger";
});

// Render / Container Health Check & Root landing
app.MapGet("/", () => Results.Ok(new
{
    status = "online",
    service = "Velessa Haute Joaillerie API",
    documentation = "/swagger",
    timestamp = DateTime.UtcNow
}));
app.MapGet("/health", () => Results.Ok(new { status = "healthy", time = DateTime.UtcNow }));

if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
