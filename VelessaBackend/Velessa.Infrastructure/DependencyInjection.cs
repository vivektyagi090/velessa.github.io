using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Velessa.Application.Common.Interfaces;
using Velessa.Infrastructure.Persistence;

namespace Velessa.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString, b =>
                b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        services.AddScoped<ApplicationDbContextInitialiser>();

        services.AddSingleton<IPasswordHasher, Services.PasswordHasher>();
        services.AddScoped<IJwtTokenService, Services.JwtTokenService>();
        services.AddScoped<IOtpService, Services.OtpService>();
        services.AddScoped<IGoogleAuthService, Services.GoogleAuthService>();

        return services;
    }
}
