using PharmacyApp.Core.Entities;

namespace PharmacyApp.Core.Interfaces;

public interface ISaleRepository
{
    Task<IReadOnlyList<Sale>> GetAllAsync(Guid? medicineId, CancellationToken cancellationToken);

    Task<Sale?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Sale?> RecordSaleAsync(
        Guid medicineId,
        Func<Medicine, Sale> createSale,
        CancellationToken cancellationToken);
}
