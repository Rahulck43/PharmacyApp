using PharmacyApp.Core.DTOs;

namespace PharmacyApp.Core.Services;

public interface ISaleService
{
    Task<IReadOnlyList<SaleResponse>> GetAllAsync(CancellationToken cancellationToken);

    Task<SaleResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<SaleResponse> CreateAsync(CreateSaleRequest request, CancellationToken cancellationToken);
}
