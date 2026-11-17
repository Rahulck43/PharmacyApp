using PharmacyApp.Core.DTOs;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Options;

namespace PharmacyApp.Core.Mappings;

public static class MappingExtensions
{
    public static MedicineResponse ToResponse(
        this Medicine medicine, DateOnly today, InventoryOptions options) =>
        new(
            medicine.Id,
            medicine.FullName,
            medicine.Brand,
            medicine.ExpiryDate,
            medicine.Quantity,
            medicine.Price,
            medicine.IsExpiringSoon(today, options.ExpiryWarningDays),
            medicine.IsLowStock(options.LowStockThreshold));

    public static MedicineDetailsResponse ToDetailsResponse(
        this Medicine medicine, DateOnly today, InventoryOptions options) =>
        new(
            medicine.Id,
            medicine.FullName,
            medicine.Notes,
            medicine.Brand,
            medicine.ExpiryDate,
            medicine.Quantity,
            medicine.Price,
            medicine.IsExpiringSoon(today, options.ExpiryWarningDays),
            medicine.IsLowStock(options.LowStockThreshold),
            medicine.CreatedAt);

    public static SaleResponse ToResponse(this Sale sale) =>
        new(
            sale.Id,
            sale.MedicineId,
            sale.MedicineName,
            sale.Quantity,
            sale.UnitPrice,
            sale.TotalAmount,
            sale.SoldAt);
}
