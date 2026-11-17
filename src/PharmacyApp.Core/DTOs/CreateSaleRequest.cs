using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Core.DTOs;

public record CreateSaleRequest
{
    public required Guid MedicineId { get; init; }

    [Range(1, int.MaxValue)]
    public required int Quantity { get; init; }
}
