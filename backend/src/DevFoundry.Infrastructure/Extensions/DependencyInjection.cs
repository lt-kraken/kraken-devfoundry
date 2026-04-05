using DevFoundry.Application.Contracts;
using DevFoundry.Infrastructure.Data;
using DevFoundry.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DevFoundry.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var useInMemory = bool.TryParse(configuration["UseInMemoryDatabase"], out var parsed) && parsed;
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=devfoundry;Username=postgres;Password=postgres";

        services.AddDbContext<DevFoundryDbContext>(options =>
        {
            if (useInMemory)
            {
                options.UseInMemoryDatabase("devfoundry-mvp");
                return;
            }

            options.UseNpgsql(connectionString);
        });

        services.AddScoped<ILearningContentService, LearningContentService>();
        services.AddScoped<IProgressService, ProgressService>();
        services.AddScoped<ICodeExecutionService, MockCodeExecutionService>();
        services.AddSingleton<IAiHintService, MockAiHintService>();

        return services;
    }
}
