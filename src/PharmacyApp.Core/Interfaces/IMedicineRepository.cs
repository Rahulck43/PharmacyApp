using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces;

public interface IMedicineRepository
{
    Task<IReadOnlyList<Medicine>> GetAllAsync(string? search, CancellationToken cancellationToken);

    Task<Medicine?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task AddAsync(Medicine medicine, CancellationToken cancellationToken);
}
