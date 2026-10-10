using FitCore.Api.Data;
using FitCore.Api.DTOs;
using FitCore.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitCore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProgrammesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProgrammesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Helper: map TrainingProgramme -> TrainingProgrammeDto
    private static TrainingProgrammeDto ToDto(TrainingProgramme p)
    {
        return new TrainingProgrammeDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Duration = p.Duration,
            FitnessGoal = p.FitnessGoal
        };
    }

    // GET /api/programmes
    [HttpGet]
    [Authorize(Roles = "Admin,Trainer,Member")]
    public async Task<ActionResult<IEnumerable<TrainingProgrammeDto>>> GetProgrammes()
    {
        var list = await _context.TrainingProgrammes
            .OrderBy(p => p.Id)
            .ToListAsync();

        return Ok(list.Select(ToDto));
    }

    // GET /api/programmes/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Trainer,Member")]
    public async Task<ActionResult<TrainingProgrammeDto>> GetProgramme(int id)
    {
        var p = await _context.TrainingProgrammes.FindAsync(id);
        if (p == null) return NotFound();
        return Ok(ToDto(p));
    }

    // POST /api/programmes
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TrainingProgrammeDto>> CreateProgramme([FromBody] CreateTrainingProgrammeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var programme = new TrainingProgramme
        {
            Name = dto.Name,
            Description = dto.Description,
            Duration = dto.Duration,
            FitnessGoal = dto.FitnessGoal
        };

        _context.TrainingProgrammes.Add(programme);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProgramme), new { id = programme.Id }, ToDto(programme));
    }

    // PUT /api/programmes/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TrainingProgrammeDto>> UpdateProgramme(int id, [FromBody] CreateTrainingProgrammeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var programme = await _context.TrainingProgrammes.FindAsync(id);
        if (programme == null) return NotFound();

        programme.Name = dto.Name;
        programme.Description = dto.Description;
        programme.Duration = dto.Duration;
        programme.FitnessGoal = dto.FitnessGoal;

        await _context.SaveChangesAsync();
        return Ok(ToDto(programme));
    }

    // DELETE /api/programmes/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProgramme(int id)
    {
        var programme = await _context.TrainingProgrammes.FindAsync(id);
        if (programme == null) return NotFound();

        _context.TrainingProgrammes.Remove(programme);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}