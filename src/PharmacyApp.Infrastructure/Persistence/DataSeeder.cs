using PharmacyApp.Core.Entities;

namespace PharmacyApp.Infrastructure.Persistence;

public class DataSeeder
{
    private readonly JsonDataStore _store;
    private readonly TimeProvider _timeProvider;

    public DataSeeder(JsonDataStore store, TimeProvider timeProvider)
    {
        _store = store;
        _timeProvider = timeProvider;
    }

    public Task SeedAsync(CancellationToken cancellationToken) =>
        _store.UpdateAsync(data =>
        {
            if (data.Medicines.Count > 0 || data.Sales.Count > 0)
            {
                return;
            }

            var now = _timeProvider.GetUtcNow();
            var today = DateOnly.FromDateTime(_timeProvider.GetLocalNow().DateTime);

            Medicine Add(string name, string brand, int expiresInDays, int quantity, decimal price, string notes)
            {
                var medicine = Medicine.Create(
                    name, notes, today.AddDays(expiresInDays), quantity, price, brand, now);
                data.Medicines.Add(medicine);
                return medicine;
            }

            var paracetamol = Add("Paracetamol 500mg", "Calpol", 365, 120, 25.50m, "Normal stock, long expiry.");
            var amoxicillin = Add("Amoxicillin 250mg", "Mox", 10, 40, 85.00m, "Expires in 10 days (red).");
            Add("Cough Syrup 100ml", "Benadryl", -5, 25, 110.00m, "Already expired (red, cannot be sold).");
            Add("Cetirizine 10mg", "Zyrtec", 200, 5, 35.00m, "Low stock (yellow).");
            Add("Ibuprofen 400mg", "Brufen", 15, 6, 48.75m, "Expiring soon and low stock (red wins).");
            Add("Vitamin C 500mg", "Limcee", 180, 10, 22.00m, "Boundary: exactly 10 units (not yellow).");
            Add("Metformin 500mg", "Glycomet", 300, 9, 30.25m, "Boundary: 9 units (yellow).");
            Add("Omeprazole 20mg", "Omez", 30, 50, 60.00m, "Boundary: expires in exactly 30 days (not red).");
            Add("Azithromycin 500mg", "Azee", 29, 30, 120.00m, "Boundary: expires in 29 days (red).");

            paracetamol.DeductStock(10);
            data.Sales.Add(Sale.Create(paracetamol, 10, now.AddDays(-1)));

            amoxicillin.DeductStock(2);
            data.Sales.Add(Sale.Create(amoxicillin, 2, now.AddHours(-2)));
        }, cancellationToken);
}
