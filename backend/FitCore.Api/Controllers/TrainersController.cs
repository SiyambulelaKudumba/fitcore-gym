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
public class TrainersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TrainersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Helper: current trainer id from JWT
    private int? CurrentTrainerId
    {
        get
        {
            var claim = User.FindFirst("trainerId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }
    }

    // Helper: map Trainer -> TrainerDto
    private static TrainerDto ToDto(Trainer t) => new()
    {
        Id = t.Id,
        StaffNumber = t.StaffNumber,
        FirstName = t.FirstName,
        LastName = t.LastName,
        Gender = t.Gender,
        Email = t.Email,
        PhoneNumber = t.PhoneNumber,
        Specialization = t.Specialization
    };

    // Helper: map Member -> MemberDto
    private static MemberDto MemberToDto(Member m) => new()
    {
        Id = m.Id,
        MemberNumber = m.MemberNumber,
        FirstName = m.FirstName,
        LastName = m.LastName,
        Gender = m.Gender,
        DateOfBirth = m.DateOfBirth,
        HomeAddress = m.HomeAddress,
        Email = m.Email,
        PhoneNumber = m.PhoneNumber,
        MembershipType = m.MembershipType,
        JoinDate = m.JoinDate,
        TrainerId = m.TrainerId,
        TrainerName = m.Trainer != null ? $"{m.Trainer.FirstName} {m.Trainer.LastName}" : null,
        TrainingProgrammeId = m.TrainingProgrammeId,
        TrainingProgrammeName = m.TrainingProgramme?.Name
    };

    // GET /api/trainers?search=&searchBy=staffNumber|name|surname
    [HttpGet]
    [Authorize(Roles = "Admin,Member")]
    public async Task<ActionResult<IEnumerable<TrainerDto>>> GetTrainers(
        [FromQuery] string? search,
        [FromQuery] string? searchBy)
    {
        var query = _context.Trainers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = (searchBy?.ToLower()) switch
            {
                "staffnumber" => query.Where(t => t.StaffNumber.ToLower().Contains(s)),
                "name"        => query.Where(t => t.FirstName.ToLower().Contains(s)),
                "surname"     => query.Where(t => t.LastName.ToLower().Contains(s)),
                _             => query.Where(t =>
                                     t.StaffNumber.ToLower().Contains(s) ||
                                     t.FirstName.ToLower().Contains(s) ||
                                     t.LastName.ToLower().Contains(s))
            };
        }

        var list = await query.OrderBy(t => t.Id).ToListAsync();
        return Ok(list.Select(ToDto));
    }

    // GET /api/trainers/me/members  (Trainer's own assigned members)
    [HttpGet("me/members")]
    [Authorize(Roles = "Trainer")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMyMembers()
    {
        var trainerId = CurrentTrainerId;
        if (trainerId == null || trainerId == 0) return Forbid();

        var members = await _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .Where(m => m.TrainerId == trainerId)
            .OrderBy(m => m.Id)
            .ToListAsync();

        return Ok(members.Select(MemberToDto));
    }

    // GET /api/trainers/me/members/{memberId}/programmes
    [HttpGet("me/members/{memberId:int}/programmes")]
    [Authorize(Roles = "Trainer")]
    public async Task<ActionResult<IEnumerable<TrainingProgrammeDto>>> GetMemberProgrammes(int memberId)
    {
        var trainerId = CurrentTrainerId;
        if (trainerId == null || trainerId == 0) return Forbid();

        // Ensure this member is assigned to the current trainer
        var member = await _context.Members
            .Include(m => m.TrainingProgramme)
            .FirstOrDefaultAsync(m => m.Id == memberId);

        if (member == null) return NotFound();
        if (member.TrainerId != trainerId) return Forbid();

        if (member.TrainingProgramme == null)
            return Ok(Array.Empty<TrainingProgrammeDto>());

        var p = member.TrainingProgramme;
        var result = new List<TrainingProgrammeDto>
        {
            new()
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Duration = p.Duration,
                FitnessGoal = p.FitnessGoal
            }
        };

        return Ok(result);
    }

    // GET /api/trainers/me/workoutplans
    [HttpGet("me/workoutplans")]
    [Authorize(Roles = "Trainer")]
    public async Task<ActionResult<IEnumerable<WorkoutPlanDto>>> GetMyWorkoutPlans()
    {
        var trainerId = CurrentTrainerId;
        if (trainerId == null || trainerId == 0) return Forbid();

        var plans = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .Include(wp => wp.TrainingProgramme)
            .Where(wp => wp.TrainerId == trainerId)
            .OrderBy(wp => wp.Id)
            .ToListAsync();

        return Ok(plans.Select(wp => new WorkoutPlanDto
        {
            Id = wp.Id,
            Name = wp.Name,
            Description = wp.Description,
            MemberId = wp.MemberId,
            MemberName = $"{wp.Member.FirstName} {wp.Member.LastName}",
            TrainerId = wp.TrainerId,
            TrainerName = $"{wp.Trainer.FirstName} {wp.Trainer.LastName}",
            TrainingProgrammeId = wp.TrainingProgrammeId,
            TrainingProgrammeName = wp.TrainingProgramme.Name,
            CreatedDate = wp.CreatedDate
        }));
    }

    // GET /api/trainers/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Member")]
    public async Task<ActionResult<TrainerDto>> GetTrainer(int id)
    {
        var t = await _context.Trainers.FindAsync(id);
        if (t == null) return NotFound();
        return Ok(ToDto(t));
    }

    // POST /api/trainers
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TrainerDto>> CreateTrainer([FromBody] CreateTrainerDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _context.Trainers.AnyAsync(t => t.Email == dto.Email))
            return Conflict(new { status = 409, message = "A trainer with this email already exists.", errors = new { } });

        string staffNumber;
        if (string.IsNullOrWhiteSpace(dto.StaffNumber))
        {
            var last = await _context.Trainers.OrderByDescending(t => t.Id).FirstOrDefaultAsync();
            var next = (last?.Id ?? 0) + 1;
            staffNumber = $"T{next:D4}";
        }
        else
        {
            staffNumber = dto.StaffNumber.Trim();
            if (await _context.Trainers.AnyAsync(t => t.StaffNumber == staffNumber))
                return Conflict(new { status = 409, message = "Staff number already in use.", errors = new { } });
        }

        var trainer = new Trainer
        {
            StaffNumber = staffNumber,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Gender = dto.Gender,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Specialization = dto.Specialization
        };

        _context.Trainers.Add(trainer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTrainer), new { id = trainer.Id }, ToDto(trainer));
    }

    // PUT /api/trainers/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TrainerDto>> UpdateTrainer(int id, [FromBody] CreateTrainerDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var trainer = await _context.Trainers.FindAsync(id);
        if (trainer == null) return NotFound();

        if (await _context.Trainers.AnyAsync(t => t.Email == dto.Email && t.Id != id))
            return Conflict(new { status = 409, message = "Another trainer already uses this email.", errors = new { } });

        if (!string.IsNullOrWhiteSpace(dto.StaffNumber) && dto.StaffNumber != trainer.StaffNumber)
        {
            if (await _context.Trainers.AnyAsync(t => t.StaffNumber == dto.StaffNumber && t.Id != id))
                return Conflict(new { status = 409, message = "Staff number already in use.", errors = new { } });
            trainer.StaffNumber = dto.StaffNumber.Trim();
        }

        trainer.FirstName = dto.FirstName;
        trainer.LastName = dto.LastName;
        trainer.Gender = dto.Gender;
        trainer.Email = dto.Email;
        trainer.PhoneNumber = dto.PhoneNumber;
        trainer.Specialization = dto.Specialization;

        await _context.SaveChangesAsync();
        return Ok(ToDto(trainer));
    }

    // DELETE /api/trainers/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTrainer(int id)
    {
        var trainer = await _context.Trainers.FindAsync(id);
        if (trainer == null) return NotFound();

        // Unassign from members first (FK has OnDelete SetNull, but be explicit)
        var members = await _context.Members.Where(m => m.TrainerId == id).ToListAsync();
        foreach (var m in members) m.TrainerId = null;

        _context.Trainers.Remove(trainer);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}