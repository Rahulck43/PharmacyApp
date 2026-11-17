using Microsoft.Extensions.Options;
using PharmacyApp.Core.DTOs;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Exceptions;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Core.Mappings;
using PharmacyApp.Core.Options;

namespace PharmacyApp.Core.Services;

public class MedicineService : IMedicineService
{
    private readonly IMedicineRepository _medicineRepository;
    private readonly TimeProvider _timeProvider;
    private readonly InventoryOptions _options;

    public MedicineService(
        IMedicineRepository medicineRepository,
        TimeProvider timeProvider,
        IOptions<InventoryOptions> options)
    {
        _medicineRepository = medicineRepository;
        _timeProvider = timeProvider;
        _options = options.Value;
    }

    private DateOnly Today => DateOnly.FromDateTime(_timeProvider.GetLocalNow().DateTime);

    public async Task<IReadOnlyList<MedicineResponse>> GetAllAsync(
        string? search, CancellationToken cancellationToken)
    {
        var medicines = await _medicineRepository.GetAllAsync(search, cancellationToken);
        var today = Today;

        return medicines.Select(m => m.ToResponse(today, _options)).ToList();
    }

    public async Task<MedicineDetailsResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var medicine = await _medicineRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Medicine", id);

        return medicine.ToDetailsResponse(Today, _options);
    }

    public async Task<MedicineDetailsResponse> CreateAsync(
        CreateMedicineRequest request, CancellationToken cancellationToken)
    {
        var today = Today;

        if (request.ExpiryDate < today)
        {
            throw new BusinessRuleException("Cannot add a medicine that has already expired.");
        }

        var medicine = Medicine.Create(
            request.FullName,
            request.Notes,
            request.ExpiryDate,
            request.Quantity,
            request.Price,
            request.Brand,
            _timeProvider.GetUtcNow());

        await _medicineRepository.AddAsync(medicine, cancellationToken);

        return medicine.ToDetailsResponse(today, _options);
    }
}
