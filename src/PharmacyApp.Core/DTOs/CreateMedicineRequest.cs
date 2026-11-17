using System.ComponentModel.DataAnnotations;
using PharmacyApp.Core.Validation;

namespace PharmacyApp.Core.DTOs;

public record CreateMedicineRequest
{
    [Required]
    [StringLength(200)]
    public required string FullName { get; init; }

    [StringLength(1000)]
    public string? Notes { get; init; }

    public required DateOnly ExpiryDate { get; init; }

    [Range(0, int.MaxValue)]
    public required int Quantity { get; init; }

    [Range(typeof(decimal), "0.01", "1000000",
        ParseLimitsInInvariantCulture = true,
        ConvertValueInInvariantCulture = true)]
    [MaxDecimalPlaces(2)]
    public required decimal Price { get; init; }

    [Required]
    [StringLength(100)]
    public required string Brand { get; init; }
}
