using PharmacyApp.Core.DTOs;

namespace PharmacyApp.Core.Services;

public interface IMedicineService
{
    Task<IReadOnlyList<MedicineResponse>> GetAllAsync(string? search, CancellationToken cancellationToken);

    Task<MedicineDetailsResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<MedicineDetailsResponse> CreateAsync(CreateMedicineRequest request, CancellationToken cancellationToken);
}
