using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Persistence;

namespace PharmacyApp.Infrastructure.Repositories;

public class JsonSaleRepository : ISaleRepository
{
    private readonly JsonDataStore _store;

    public JsonSaleRepository(JsonDataStore store)
    {
        _store = store;
    }

    public Task<IReadOnlyList<Sale>> GetAllAsync(Guid? medicineId, CancellationToken cancellationToken) =>
        _store.ReadAsync<IReadOnlyList<Sale>>(data =>
        {
            IEnumerable<Sale> sales = data.Sales;

            if (medicineId.HasValue)
            {
                sales = sales.Where(s => s.MedicineId == medicineId.Value);
            }

            return sales.OrderByDescending(s => s.SoldAt).ToList();
        }, cancellationToken);

    public Task<Sale?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _store.ReadAsync(data => data.Sales.FirstOrDefault(s => s.Id == id), cancellationToken);

    public Task<Sale?> RecordSaleAsync(
        Guid medicineId,
        Func<Medicine, Sale> createSale,
        CancellationToken cancellationToken) =>
        _store.UpdateAsync<Sale?>(data =>
        {
            var medicine = data.Medicines.FirstOrDefault(m => m.Id == medicineId);
            if (medicine is null)
            {
                return null;
            }

            var sale = createSale(medicine);
            data.Sales.Add(sale);
            return sale;
        }, cancellationToken);
}
