using Microsoft.Extensions.DependencyInjection;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Options;
using PharmacyApp.Infrastructure.Persistence;
using PharmacyApp.Infrastructure.Repositories;

namespace PharmacyApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddOptions<StorageOptions>()
            .BindConfiguration(StorageOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<JsonDataStore>();
        services.AddScoped<IMedicineRepository, JsonMedicineRepository>();
        services.AddScoped<ISaleRepository, JsonSaleRepository>();

        return services;
    }
}
