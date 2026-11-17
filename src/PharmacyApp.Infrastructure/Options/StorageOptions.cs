using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Infrastructure.Options;

public class StorageOptions
{
    public const string SectionName = "Storage";

    [Required]
    public string FilePath { get; set; } = "App_Data/pharmacy.json";
}
