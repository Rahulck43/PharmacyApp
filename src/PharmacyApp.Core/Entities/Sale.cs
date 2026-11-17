namespace PharmacyApp.Core.Entities;

public class Sale
{
    public Sale(
        Guid id,
        Guid medicineId,
        string medicineName,
        int quantity,
        decimal unitPrice,
        decimal totalAmount,
        DateTimeOffset soldAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(medicineName);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);

        Id = id;
        MedicineId = medicineId;
        MedicineName = medicineName;
        Quantity = quantity;
        UnitPrice = unitPrice;
        TotalAmount = totalAmount;
        SoldAt = soldAt;
    }

    public Guid Id { get; private set; }
    public Guid MedicineId { get; private set; }
    public string MedicineName { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal TotalAmount { get; private set; }
    public DateTimeOffset SoldAt { get; private set; }

    public static Sale Create(Medicine medicine, int quantity, DateTimeOffset soldAt)
    {
        ArgumentNullException.ThrowIfNull(medicine);

        var totalAmount = Math.Round(
            medicine.Price * quantity, 2, MidpointRounding.AwayFromZero);

        return new Sale(
            Guid.NewGuid(),
            medicine.Id,
            medicine.FullName,
            quantity,
            medicine.Price,
            totalAmount,
            soldAt);
    }
}
