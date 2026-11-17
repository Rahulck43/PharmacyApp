using Microsoft.Extensions.DependencyInjection;
using PharmacyApp.Core.Services;

namespace PharmacyApp.Core;

public static class DependencyInjection
{
    public static IServiceCollection AddCore(this IServiceCollection services)
    {
        services.AddScoped<IMedicineService, MedicineService>();
        services.AddScoped<ISaleService, SaleService>();

        return services;
    }
}
