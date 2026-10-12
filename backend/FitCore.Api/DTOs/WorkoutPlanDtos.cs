using System.ComponentModel.DataAnnotations;

namespace FitCore.Api.DTOs;

public class WorkoutPlanDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MemberId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public int TrainerId { get; set; }
    public string TrainerName { get; set; } = string.Empty;
    public int TrainingProgrammeId { get; set; }
    public string TrainingProgrammeName { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

public class CreateWorkoutPlanDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public int MemberId { get; set; }

    public int? TrainerId { get; set; } // Optional for Trainer; required for Admin

    [Required]
    public int TrainingProgrammeId { get; set; }
}