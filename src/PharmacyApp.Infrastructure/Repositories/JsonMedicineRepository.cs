using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Infrastructure.Persistence;

namespace PharmacyApp.Infrastructure.Repositories;

public class JsonMedicineRepository : IMedicineRepository
{
    private readonly JsonDataStore _store;

    public JsonMedicineRepository(JsonDataStore store)
    {
        _store = store;
    }

    public Task<IReadOnlyList<Medicine>> GetAllAsync(string? search, CancellationToken cancellationToken) =>
        _store.ReadAsync<IReadOnlyList<Medicine>>(data =>
        {
            IEnumerable<Medicine> medicines = data.Medicines;

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                medicines = medicines.Where(m =>
                    m.FullName.Contains(term, StringComparison.OrdinalIgnoreCase));
            }

            return medicines.OrderBy(m => m.FullName).ToList();
        }, cancellationToken);

    public Task<Medicine?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _store.ReadAsync(data => data.Medicines.FirstOrDefault(m => m.Id == id), cancellationToken);

    public Task AddAsync(Medicine medicine, CancellationToken cancellationToken) =>
        _store.UpdateAsync(data => data.Medicines.Add(medicine), cancellationToken);
}
