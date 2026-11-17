using Microsoft.AspNetCore.Mvc;
using PharmacyApp.Core.DTOs;
using PharmacyApp.Core.Services;

namespace PharmacyApp.Api.Controllers;

[ApiController]
[Route("api/medicines")]
[Produces("application/json")]
public class MedicinesController : ControllerBase
{
    private readonly IMedicineService _medicineService;

    public MedicinesController(IMedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<MedicineResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MedicineResponse>>> GetAll(
        [FromQuery] string? search, CancellationToken cancellationToken)
    {
        var medicines = await _medicineService.GetAllAsync(search, cancellationToken);
        return Ok(medicines);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<MedicineDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MedicineDetailsResponse>> GetById(
        Guid id, CancellationToken cancellationToken)
    {
        var medicine = await _medicineService.GetByIdAsync(id, cancellationToken);
        return Ok(medicine);
    }

    [HttpPost]
    [ProducesResponseType<MedicineDetailsResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<MedicineDetailsResponse>> Create(
        CreateMedicineRequest request, CancellationToken cancellationToken)
    {
        var medicine = await _medicineService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = medicine.Id }, medicine);
    }
}
