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
public class MembersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MembersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Helper: read current user's MemberId from JWT claims
    private int? CurrentMemberId
    {
        get
        {
            var claim = User.FindFirst("memberId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }
    }

    // Helper: map Member entity -> MemberDto
    private static MemberDto ToDto(Member m) => new()
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

    // GET /api/members?search=&searchBy=memberNumber|name|surname
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers(
        [FromQuery] string? search,
        [FromQuery] string? searchBy)
    {
        var query = _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = (searchBy?.ToLower()) switch
            {
                "membernumber" => query.Where(m => m.MemberNumber.ToLower().Contains(s)),
                "name"         => query.Where(m => m.FirstName.ToLower().Contains(s)),
                "surname"      => query.Where(m => m.LastName.ToLower().Contains(s)),
                _              => query.Where(m =>
                                       m.MemberNumber.ToLower().Contains(s) ||
                                       m.FirstName.ToLower().Contains(s) ||
                                       m.LastName.ToLower().Contains(s))
            };
        }

        var list = await query.OrderBy(m => m.Id).ToListAsync();
        return Ok(list.Select(ToDto));
    }

    // GET /api/members/me  (Member role only — must be before {id} route)
    [HttpGet("me")]
    [Authorize(Roles = "Member")]
    public async Task<ActionResult<MemberDto>> GetMyProfile()
    {
        var memberId = CurrentMemberId;
        if (memberId == null) return Forbid();

        var member = await _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .FirstOrDefaultAsync(m => m.Id == memberId);

        if (member == null) return NotFound();
        return Ok(ToDto(member));
    }

    // GET /api/members/me/programme
    [HttpGet("me/programme")]
    [Authorize(Roles = "Member")]
    public async Task<ActionResult<TrainingProgrammeDto>> GetMyProgramme()
    {
        var memberId = CurrentMemberId;
        if (memberId == null) return Forbid();

        var member = await _context.Members
            .Include(m => m.TrainingProgramme)
            .FirstOrDefaultAsync(m => m.Id == memberId);

        if (member == null) return NotFound();
        if (member.TrainingProgramme == null) return NotFound();

        var p = member.TrainingProgramme;
        return Ok(new TrainingProgrammeDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Duration = p.Duration,
            FitnessGoal = p.FitnessGoal
        });
    }

    // GET /api/members/me/workoutplans
    [HttpGet("me/workoutplans")]
    [Authorize(Roles = "Member")]
    public async Task<ActionResult<IEnumerable<WorkoutPlanDto>>> GetMyWorkoutPlans()
    {
        var memberId = CurrentMemberId;
        if (memberId == null) return Forbid();

        var plans = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .Include(wp => wp.TrainingProgramme)
            .Where(wp => wp.MemberId == memberId)
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

    // GET /api/members/me/workouttasks?status=NotStarted|InProgress|Complete
    [HttpGet("me/workouttasks")]
    [Authorize(Roles = "Member")]
    public async Task<ActionResult<IEnumerable<WorkoutTaskDto>>> GetMyWorkoutTasks(
        [FromQuery] WorkoutTaskStatus? status)
    {
        var memberId = CurrentMemberId;
        if (memberId == null) return Forbid();

        var query = _context.WorkoutTasks
            .Include(wt => wt.WorkoutPlan)
            .Where(wt => wt.WorkoutPlan.MemberId == memberId);

        if (status.HasValue)
            query = query.Where(wt => wt.Status == status.Value);

        var tasks = await query.OrderBy(wt => wt.Id).ToListAsync();

        return Ok(tasks.Select(wt => new WorkoutTaskDto
        {
            Id = wt.Id,
            ExerciseName = wt.ExerciseName,
            Description = wt.Description,
            NumberOfSets = wt.NumberOfSets,
            NumberOfRepetitions = wt.NumberOfRepetitions,
            DueDate = wt.DueDate,
            Status = wt.Status,
            WorkoutPlanId = wt.WorkoutPlanId,
            WorkoutPlanName = wt.WorkoutPlan.Name,
            MemberId = wt.WorkoutPlan.MemberId
        }));
    }

    // GET /api/members/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Member")]
    public async Task<ActionResult<MemberDto>> GetMember(int id)
    {
        // Member can only view their own record
        if (User.IsInRole("Member"))
        {
            var myId = CurrentMemberId;
            if (myId == null || myId != id) return Forbid();
        }

        var member = await _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (member == null) return NotFound();
        return Ok(ToDto(member));
    }

    // POST /api/members
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MemberDto>> CreateMember([FromBody] CreateMemberDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Duplicate email check
        if (await _context.Members.AnyAsync(m => m.Email == dto.Email))
            return Conflict(new { status = 409, message = "A member with this email already exists.", errors = new { } });

        // Auto-generate MemberNumber if not supplied
        string memberNumber;
        if (string.IsNullOrWhiteSpace(dto.MemberNumber))
        {
            var last = await _context.Members.OrderByDescending(m => m.Id).FirstOrDefaultAsync();
            var next = (last?.Id ?? 0) + 1;
            memberNumber = $"M{next:D4}";
        }
        else
        {
            memberNumber = dto.MemberNumber.Trim();
            if (await _context.Members.AnyAsync(m => m.MemberNumber == memberNumber))
                return Conflict(new { status = 409, message = "Member number already in use.", errors = new { } });
        }

        // FK existence checks
        if (dto.TrainerId.HasValue && !await _context.Trainers.AnyAsync(t => t.Id == dto.TrainerId.Value))
            return BadRequest(new { status = 400, message = "Trainer not found.", errors = new { } });

        if (dto.TrainingProgrammeId.HasValue && !await _context.TrainingProgrammes.AnyAsync(p => p.Id == dto.TrainingProgrammeId.Value))
            return BadRequest(new { status = 400, message = "Training programme not found.", errors = new { } });

        var member = new Member
        {
            MemberNumber = memberNumber,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth,
            HomeAddress = dto.HomeAddress,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            MembershipType = dto.MembershipType,
            JoinDate = DateTime.Today,
            TrainerId = dto.TrainerId,
            TrainingProgrammeId = dto.TrainingProgrammeId
        };

        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        // Reload with navigation props for the DTO
        await _context.Entry(member).Reference(m => m.Trainer).LoadAsync();
        await _context.Entry(member).Reference(m => m.TrainingProgramme).LoadAsync();

        return CreatedAtAction(nameof(GetMember), new { id = member.Id }, ToDto(member));
    }

    // PUT /api/members/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MemberDto>> UpdateMember(int id, [FromBody] CreateMemberDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var member = await _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (member == null) return NotFound();

        // Email uniqueness (exclude self)
        if (await _context.Members.AnyAsync(m => m.Email == dto.Email && m.Id != id))
            return Conflict(new { status = 409, message = "Another member already uses this email.", errors = new { } });

        // MemberNumber uniqueness if changed
        if (!string.IsNullOrWhiteSpace(dto.MemberNumber) && dto.MemberNumber != member.MemberNumber)
        {
            if (await _context.Members.AnyAsync(m => m.MemberNumber == dto.MemberNumber && m.Id != id))
                return Conflict(new { status = 409, message = "Member number already in use.", errors = new { } });
            member.MemberNumber = dto.MemberNumber.Trim();
        }

        if (dto.TrainerId.HasValue && !await _context.Trainers.AnyAsync(t => t.Id == dto.TrainerId.Value))
            return BadRequest(new { status = 400, message = "Trainer not found.", errors = new { } });

        if (dto.TrainingProgrammeId.HasValue && !await _context.TrainingProgrammes.AnyAsync(p => p.Id == dto.TrainingProgrammeId.Value))
            return BadRequest(new { status = 400, message = "Training programme not found.", errors = new { } });

        member.FirstName = dto.FirstName;
        member.LastName = dto.LastName;
        member.Gender = dto.Gender;
        member.DateOfBirth = dto.DateOfBirth;
        member.HomeAddress = dto.HomeAddress;
        member.Email = dto.Email;
        member.PhoneNumber = dto.PhoneNumber;
        member.MembershipType = dto.MembershipType;
        member.TrainerId = dto.TrainerId;
        member.TrainingProgrammeId = dto.TrainingProgrammeId;

        await _context.SaveChangesAsync();

        await _context.Entry(member).Reference(m => m.Trainer).LoadAsync();
        await _context.Entry(member).Reference(m => m.TrainingProgramme).LoadAsync();

        return Ok(ToDto(member));
    }

    // DELETE /api/members/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteMember(int id)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null) return NotFound();

        _context.Members.Remove(member);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PUT /api/members/{id}/trainer
    [HttpPut("{id:int}/trainer")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MemberDto>> AssignTrainer(int id, [FromBody] AssignTrainerDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var member = await _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (member == null) return NotFound();

        if (!await _context.Trainers.AnyAsync(t => t.Id == dto.TrainerId))
            return BadRequest(new { status = 400, message = "Trainer not found.", errors = new { } });

        member.TrainerId = dto.TrainerId;
        await _context.SaveChangesAsync();

        await _context.Entry(member).Reference(m => m.Trainer).LoadAsync();
        return Ok(ToDto(member));
    }

    // PUT /api/members/{id}/programme
    [HttpPut("{id:int}/programme")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<MemberDto>> AssignProgramme(int id, [FromBody] AssignProgrammeDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var member = await _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (member == null) return NotFound();

        if (!await _context.TrainingProgrammes.AnyAsync(p => p.Id == dto.TrainingProgrammeId))
            return BadRequest(new { status = 400, message = "Training programme not found.", errors = new { } });

        member.TrainingProgrammeId = dto.TrainingProgrammeId;
        await _context.SaveChangesAsync();

        await _context.Entry(member).Reference(m => m.TrainingProgramme).LoadAsync();
        return Ok(ToDto(member));
    }
}