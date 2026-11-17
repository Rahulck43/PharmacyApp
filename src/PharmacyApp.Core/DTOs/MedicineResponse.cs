namespace PharmacyApp.Core.DTOs;

public record MedicineResponse(
    Guid Id,
    string FullName,
    string Brand,
    DateOnly ExpiryDate,
    int Quantity,
    decimal Price,
    bool IsExpiringSoon,
    bool IsLowStock);
