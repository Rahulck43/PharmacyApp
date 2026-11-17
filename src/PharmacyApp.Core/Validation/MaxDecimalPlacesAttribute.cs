using System.ComponentModel.DataAnnotations;

namespace PharmacyApp.Core.Validation;

[AttributeUsage(AttributeTargets.Property)]
public class MaxDecimalPlacesAttribute : ValidationAttribute
{
    private readonly int _places;

    public MaxDecimalPlacesAttribute(int places)
    {
        _places = places;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is not decimal number)
        {
            return ValidationResult.Success;
        }

        var scaled = number * (decimal)Math.Pow(10, _places);

        return scaled == decimal.Truncate(scaled)
            ? ValidationResult.Success
            : new ValidationResult(
                $"{validationContext.DisplayName} can have at most {_places} decimal places.");
    }
}
