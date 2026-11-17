namespace PharmacyApp.Core.DTOs;

public record MedicineDetailsResponse(
    Guid Id,
    string FullName,
    string? Notes,
    string Brand,
    DateOnly ExpiryDate,
    int Quantity,
    decimal Price,
    bool IsExpiringSoon,
    bool IsLowStock,
    DateTimeOffset CreatedAt);
