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
public class WorkoutPlansController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WorkoutPlansController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Read current user's ids from JWT
    private int? CurrentMemberId
    {
        get
        {
            var claim = User.FindFirst("memberId")?.Value;
            if (int.TryParse(claim, out var id) && id > 0) return id;
            return null;
        }
    }

    private int? CurrentTrainerId
    {
        get
        {
            var claim = User.FindFirst("trainerId")?.Value;
            if (int.TryParse(claim, out var id) && id > 0) return id;
            return null;
        }
    }

    // Helper: map WorkoutPlan -> WorkoutPlanDto
    private static WorkoutPlanDto ToDto(WorkoutPlan wp)
    {
        return new WorkoutPlanDto
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
        };
    }

    // GET /api/workoutplans  (Admin only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<WorkoutPlanDto>>> GetWorkoutPlans()
    {
        var plans = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .Include(wp => wp.TrainingProgramme)
            .OrderBy(wp => wp.Id)
            .ToListAsync();

        return Ok(plans.Select(ToDto));
    }

    // GET /api/workoutplans/trainer/me  (Trainer's own plans)
    [HttpGet("trainer/me")]
    [Authorize(Roles = "Trainer")]
    public async Task<ActionResult<IEnumerable<WorkoutPlanDto>>> GetMyTrainerPlans()
    {
        var trainerId = CurrentTrainerId;
        if (trainerId == null) return Forbid();

        var plans = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .Include(wp => wp.TrainingProgramme)
            .Where(wp => wp.TrainerId == trainerId)
            .OrderBy(wp => wp.Id)
            .ToListAsync();

        return Ok(plans.Select(ToDto));
    }

    // GET /api/workoutplans/member/{memberId}
    [HttpGet("member/{memberId:int}")]
    [Authorize(Roles = "Admin,Trainer,Member")]
    public async Task<ActionResult<IEnumerable<WorkoutPlanDto>>> GetPlansByMember(int memberId)
    {
        // Member can only view own
        if (User.IsInRole("Member"))
        {
            var myId = CurrentMemberId;
            if (myId == null || myId != memberId) return Forbid();
        }

        // Trainer must be assigned to this member
        if (User.IsInRole("Trainer"))
        {
            var trainerId = CurrentTrainerId;
            var member = await _context.Members.FindAsync(memberId);
            if (member == null) return NotFound();
            if (member.TrainerId != trainerId) return Forbid();
        }

        var plans = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .Include(wp => wp.TrainingProgramme)
            .Where(wp => wp.MemberId == memberId)
            .OrderBy(wp => wp.Id)
            .ToListAsync();

        return Ok(plans.Select(ToDto));
    }

    // GET /api/workoutplans/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Trainer,Member")]
    public async Task<ActionResult<WorkoutPlanDto>> GetWorkoutPlan(int id)
    {
        var plan = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .Include(wp => wp.TrainingProgramme)
            .FirstOrDefaultAsync(wp => wp.Id == id);

        if (plan == null) return NotFound();

        // Member can only view plans that belong to them
        if (User.IsInRole("Member"))
        {
            var myId = CurrentMemberId;
            if (myId == null || plan.MemberId != myId) return Forbid();
        }

        return Ok(ToDto(plan));
    }

    // POST /api/workoutplans
    [HttpPost]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<ActionResult<WorkoutPlanDto>> CreateWorkoutPlan([FromBody] CreateWorkoutPlanDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Resolve trainer id:
        // - Trainer: always their own id (ignore dto.TrainerId)
        // - Admin: must supply dto.TrainerId
        int trainerId;
        if (User.IsInRole("Trainer"))
        {
            var myTrainerId = CurrentTrainerId;
            if (myTrainerId == null) return Forbid();
            trainerId = myTrainerId.Value;
        }
        else
        {
            if (dto.TrainerId == null)
                return BadRequest(new { status = 400, message = "TrainerId is required when creating as Admin.", errors = new { } });
            trainerId = dto.TrainerId.Value;
        }

        // FK existence checks
        if (!await _context.Members.AnyAsync(m => m.Id == dto.MemberId))
            return BadRequest(new { status = 400, message = "Member not found.", errors = new { } });

        if (!await _context.Trainers.AnyAsync(t => t.Id == trainerId))
            return BadRequest(new { status = 400, message = "Trainer not found.", errors = new { } });

        if (!await _context.TrainingProgrammes.AnyAsync(p => p.Id == dto.TrainingProgrammeId))
            return BadRequest(new { status = 400, message = "Training programme not found.", errors = new { } });

        // If caller is a Trainer, ensure the member is assigned to them
        if (User.IsInRole("Trainer"))
        {
            var member = await _context.Members.FindAsync(dto.MemberId);
            if (member == null || member.TrainerId != trainerId)
                return Forbid();
        }

        var plan = new WorkoutPlan
        {
            Name = dto.Name,
            Description = dto.Description,
            MemberId = dto.MemberId,
            TrainerId = trainerId,
            TrainingProgrammeId = dto.TrainingProgrammeId,
            CreatedDate = DateTime.Today
        };

        _context.WorkoutPlans.Add(plan);
        await _context.SaveChangesAsync();

        // Reload with navigations
        await _context.Entry(plan).Reference(p => p.Member).LoadAsync();
        await _context.Entry(plan).Reference(p => p.Trainer).LoadAsync();
        await _context.Entry(plan).Reference(p => p.TrainingProgramme).LoadAsync();

        return CreatedAtAction(nameof(GetWorkoutPlan), new { id = plan.Id }, ToDto(plan));
    }

    // PUT /api/workoutplans/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<ActionResult<WorkoutPlanDto>> UpdateWorkoutPlan(int id, [FromBody] CreateWorkoutPlanDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var plan = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .Include(wp => wp.TrainingProgramme)
            .FirstOrDefaultAsync(wp => wp.Id == id);

        if (plan == null) return NotFound();

        // Trainer can only edit their own plans
        if (User.IsInRole("Trainer"))
        {
            var myTrainerId = CurrentTrainerId;
            if (myTrainerId == null || plan.TrainerId != myTrainerId) return Forbid();
        }

        // FK checks (ignore TrainerId change here — keep the original trainer)
        if (!await _context.Members.AnyAsync(m => m.Id == dto.MemberId))
            return BadRequest(new { status = 400, message = "Member not found.", errors = new { } });

        if (!await _context.TrainingProgrammes.AnyAsync(p => p.Id == dto.TrainingProgrammeId))
            return BadRequest(new { status = 400, message = "Training programme not found.", errors = new { } });

        plan.Name = dto.Name;
        plan.Description = dto.Description;
        plan.MemberId = dto.MemberId;
        plan.TrainingProgrammeId = dto.TrainingProgrammeId;

        await _context.SaveChangesAsync();

        // Reload navigations in case MemberId changed
        await _context.Entry(plan).Reference(p => p.Member).LoadAsync();
        await _context.Entry(plan).Reference(p => p.Trainer).LoadAsync();
        await _context.Entry(plan).Reference(p => p.TrainingProgramme).LoadAsync();

        return Ok(ToDto(plan));
    }

    // DELETE /api/workoutplans/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> DeleteWorkoutPlan(int id)
    {
        var plan = await _context.WorkoutPlans.FindAsync(id);
        if (plan == null) return NotFound();

        // Trainer can only delete their own
        if (User.IsInRole("Trainer"))
        {
            var myTrainerId = CurrentTrainerId;
            if (myTrainerId == null || plan.TrainerId != myTrainerId) return Forbid();
        }

        _context.WorkoutPlans.Remove(plan);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}