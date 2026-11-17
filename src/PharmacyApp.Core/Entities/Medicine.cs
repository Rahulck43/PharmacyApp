using PharmacyApp.Core.Exceptions;

namespace PharmacyApp.Core.Entities;

public class Medicine
{
    public Medicine(
        Guid id,
        string fullName,
        string? notes,
        DateOnly expiryDate,
        int quantity,
        decimal price,
        string brand,
        DateTimeOffset createdAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(fullName);
        ArgumentException.ThrowIfNullOrWhiteSpace(brand);
        ArgumentOutOfRangeException.ThrowIfNegative(quantity);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(price);

        Id = id;
        FullName = fullName;
        Notes = notes;
        ExpiryDate = expiryDate;
        Quantity = quantity;
        Price = price;
        Brand = brand;
        CreatedAt = createdAt;
    }

    public Guid Id { get; private set; }
    public string FullName { get; private set; }
    public string? Notes { get; private set; }
    public DateOnly ExpiryDate { get; private set; }
    public int Quantity { get; private set; }
    public decimal Price { get; private set; }
    public string Brand { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }

    public static Medicine Create(
        string fullName,
        string? notes,
        DateOnly expiryDate,
        int quantity,
        decimal price,
        string brand,
        DateTimeOffset createdAt)
    {
        return new Medicine(
            Guid.NewGuid(),
            fullName.Trim(),
            string.IsNullOrWhiteSpace(notes) ? null : notes.Trim(),
            expiryDate,
            quantity,
            Math.Round(price, 2, MidpointRounding.AwayFromZero),
            brand.Trim(),
            createdAt);
    }

    public bool IsExpired(DateOnly today) => ExpiryDate < today;

    public bool IsExpiringSoon(DateOnly today, int warningDays) =>
        ExpiryDate < today.AddDays(warningDays);

    public bool IsLowStock(int threshold) => Quantity < threshold;

    public void DeductStock(int quantity)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);

        if (quantity > Quantity)
        {
            throw new BusinessRuleException(
                $"Only {Quantity} units of '{FullName}' in stock.");
        }

        Quantity -= quantity;
    }
}
