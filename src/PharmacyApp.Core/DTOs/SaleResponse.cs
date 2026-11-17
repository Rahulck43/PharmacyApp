namespace PharmacyApp.Core.DTOs;

public record SaleResponse(
    Guid Id,
    Guid MedicineId,
    string MedicineName,
    int Quantity,
    decimal UnitPrice,
    decimal TotalAmount,
    DateTimeOffset SoldAt);
