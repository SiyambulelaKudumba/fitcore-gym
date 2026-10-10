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
public class WorkoutTasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WorkoutTasksController(ApplicationDbContext context)
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

    // Helper: map WorkoutTask -> WorkoutTaskDto
    private static WorkoutTaskDto ToDto(WorkoutTask wt)
    {
        return new WorkoutTaskDto
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
        };
    }

    // GET /api/workouttasks  (Admin only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<WorkoutTaskDto>>> GetWorkoutTasks()
    {
        var tasks = await _context.WorkoutTasks
            .Include(wt => wt.WorkoutPlan)
            .OrderBy(wt => wt.Id)
            .ToListAsync();

        return Ok(tasks.Select(ToDto));
    }

    // GET /api/workouttasks/plan/{planId}?status=NotStarted|InProgress|Complete
    [HttpGet("plan/{planId:int}")]
    [Authorize(Roles = "Admin,Trainer,Member")]
    public async Task<ActionResult<IEnumerable<WorkoutTaskDto>>> GetTasksByPlan(
        int planId,
        [FromQuery] WorkoutTaskStatus? status)
    {
        var plan = await _context.WorkoutPlans.FindAsync(planId);
        if (plan == null) return NotFound();

        // Member can only view tasks from their own plans
        if (User.IsInRole("Member"))
        {
            var myId = CurrentMemberId;
            if (myId == null || plan.MemberId != myId) return Forbid();
        }

        // Trainer must be the plan's trainer
        if (User.IsInRole("Trainer"))
        {
            var trainerId = CurrentTrainerId;
            if (trainerId == null || plan.TrainerId != trainerId) return Forbid();
        }

        var query = _context.WorkoutTasks
            .Include(wt => wt.WorkoutPlan)
            .Where(wt => wt.WorkoutPlanId == planId);

        if (status.HasValue)
            query = query.Where(wt => wt.Status == status.Value);

        var tasks = await query.OrderBy(wt => wt.Id).ToListAsync();
        return Ok(tasks.Select(ToDto));
    }

    // GET /api/workouttasks/{id}
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin,Trainer,Member")]
    public async Task<ActionResult<WorkoutTaskDto>> GetWorkoutTask(int id)
    {
        var task = await _context.WorkoutTasks
            .Include(wt => wt.WorkoutPlan)
            .FirstOrDefaultAsync(wt => wt.Id == id);

        if (task == null) return NotFound();

        // Member own-plan check
        if (User.IsInRole("Member"))
        {
            var myId = CurrentMemberId;
            if (myId == null || task.WorkoutPlan.MemberId != myId) return Forbid();
        }

        return Ok(ToDto(task));
    }

    // POST /api/workouttasks
    [HttpPost]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<ActionResult<WorkoutTaskDto>> CreateWorkoutTask([FromBody] CreateWorkoutTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var plan = await _context.WorkoutPlans
            .Include(wp => wp.Member)
            .Include(wp => wp.Trainer)
            .FirstOrDefaultAsync(wp => wp.Id == dto.WorkoutPlanId);

        if (plan == null)
            return BadRequest(new { status = 400, message = "Workout plan not found.", errors = new { } });

        // Trainer can only add tasks to their own plans
        if (User.IsInRole("Trainer"))
        {
            var trainerId = CurrentTrainerId;
            if (trainerId == null || plan.TrainerId != trainerId) return Forbid();
        }

        var task = new WorkoutTask
        {
            ExerciseName = dto.ExerciseName,
            Description = dto.Description,
            NumberOfSets = dto.NumberOfSets,
            NumberOfRepetitions = dto.NumberOfRepetitions,
            DueDate = dto.DueDate,
            Status = WorkoutTaskStatus.NotStarted,
            WorkoutPlanId = dto.WorkoutPlanId
        };

        _context.WorkoutTasks.Add(task);
        await _context.SaveChangesAsync();

        // Fill navigation for the DTO
        task.WorkoutPlan = plan;

        return CreatedAtAction(nameof(GetWorkoutTask), new { id = task.Id }, ToDto(task));
    }

    // PUT /api/workouttasks/{id}
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<ActionResult<WorkoutTaskDto>> UpdateWorkoutTask(int id, [FromBody] UpdateWorkoutTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var task = await _context.WorkoutTasks
            .Include(wt => wt.WorkoutPlan)
            .FirstOrDefaultAsync(wt => wt.Id == id);

        if (task == null) return NotFound();

        // Trainer must own the parent plan
        if (User.IsInRole("Trainer"))
        {
            var trainerId = CurrentTrainerId;
            if (trainerId == null || task.WorkoutPlan.TrainerId != trainerId) return Forbid();
        }

        task.ExerciseName = dto.ExerciseName;
        task.Description = dto.Description;
        task.NumberOfSets = dto.NumberOfSets;
        task.NumberOfRepetitions = dto.NumberOfRepetitions;
        task.DueDate = dto.DueDate;
        task.Status = dto.Status;

        await _context.SaveChangesAsync();
        return Ok(ToDto(task));
    }

    // DELETE /api/workouttasks/{id}
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Trainer,Admin")]
    public async Task<IActionResult> DeleteWorkoutTask(int id)
    {
        var task = await _context.WorkoutTasks
            .Include(wt => wt.WorkoutPlan)
            .FirstOrDefaultAsync(wt => wt.Id == id);

        if (task == null) return NotFound();

        if (User.IsInRole("Trainer"))
        {
            var trainerId = CurrentTrainerId;
            if (trainerId == null || task.WorkoutPlan.TrainerId != trainerId) return Forbid();
        }

        _context.WorkoutTasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PATCH /api/workouttasks/{id}/status
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Member,Trainer,Admin")]
    public async Task<ActionResult<WorkoutTaskDto>> UpdateWorkoutTaskStatus(int id, [FromBody] UpdateWorkoutTaskStatusDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var task = await _context.WorkoutTasks
            .Include(wt => wt.WorkoutPlan)
            .FirstOrDefaultAsync(wt => wt.Id == id);

        if (task == null) return NotFound();

        // Member can only update tasks in their own plans
        if (User.IsInRole("Member"))
        {
            var myId = CurrentMemberId;
            if (myId == null || task.WorkoutPlan.MemberId != myId) return Forbid();
        }

        // Trainer can only update tasks in their own plans
        if (User.IsInRole("Trainer"))
        {
            var trainerId = CurrentTrainerId;
            if (trainerId == null || task.WorkoutPlan.TrainerId != trainerId) return Forbid();
        }

        task.Status = dto.Status;
        await _context.SaveChangesAsync();

        return Ok(ToDto(task));
    }
}