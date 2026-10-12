using System.ComponentModel.DataAnnotations;

namespace FitCore.Api.Models;

public class WorkoutTask
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string ExerciseName { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required, Range(1, 20)]
    public int NumberOfSets { get; set; }

    [Required, Range(1, 100)]
    public int NumberOfRepetitions { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public WorkoutTaskStatus Status { get; set; } = WorkoutTaskStatus.NotStarted;

    [Required]
    public int WorkoutPlanId { get; set; }
    public WorkoutPlan WorkoutPlan { get; set; } = null!;
}