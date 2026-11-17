using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Core.Options;

public class InventoryOptions
{
    public const string SectionName = "Inventory";

    [Range(1, 365)]
    public int ExpiryWarningDays { get; set; } = 30;

    [Range(1, int.MaxValue)]
    public int LowStockThreshold { get; set; } = 10;
}
