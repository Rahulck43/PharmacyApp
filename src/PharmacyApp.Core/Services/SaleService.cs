using PharmacyApp.Core.DTOs;
using PharmacyApp.Core.Entities;
using PharmacyApp.Core.Exceptions;
using PharmacyApp.Core.Interfaces;
using PharmacyApp.Core.Mappings;

namespace PharmacyApp.Core.Services;

public class SaleService : ISaleService
{
    private readonly ISaleRepository _saleRepository;
    private readonly TimeProvider _timeProvider;

    public SaleService(ISaleRepository saleRepository, TimeProvider timeProvider)
    {
        _saleRepository = saleRepository;
        _timeProvider = timeProvider;
    }

    public async Task<IReadOnlyList<SaleResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var sales = await _saleRepository.GetAllAsync(cancellationToken);

        return sales.Select(s => s.ToResponse()).ToList();
    }

    public async Task<SaleResponse> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var sale = await _saleRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Sale", id);

        return sale.ToResponse();
    }

    public async Task<SaleResponse> CreateAsync(CreateSaleRequest request, CancellationToken cancellationToken)
    {
        var now = _timeProvider.GetUtcNow();
        var today = DateOnly.FromDateTime(_timeProvider.GetLocalNow().DateTime);

        var sale = await _saleRepository.RecordSaleAsync(
            request.MedicineId,
            medicine =>
            {
                if (medicine.IsExpired(today))
                {
                    throw new BusinessRuleException(
                        $"'{medicine.FullName}' expired on {medicine.ExpiryDate:yyyy-MM-dd} and cannot be sold.");
                }

                medicine.DeductStock(request.Quantity);
                return Sale.Create(medicine, request.Quantity, now);
            },
            cancellationToken);

        return sale?.ToResponse() ?? throw new NotFoundException("Medicine", request.MedicineId);
    }
}
