using PharmacyApp.Core.Entities;

namespace PharmacyApp.Infrastructure.Persistence;

public class PharmacyData
{
    public List<Medicine> Medicines { get; set; } = [];

    public List<Sale> Sales { get; set; } = [];
}
