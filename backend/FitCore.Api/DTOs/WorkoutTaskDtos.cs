using System.ComponentModel.DataAnnotations;
using FitCore.Api.Models;

namespace FitCore.Api.DTOs;

public class WorkoutTaskDto
{
    public int Id { get; set; }
    public string ExerciseName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int NumberOfSets { get; set; }
    public int NumberOfRepetitions { get; set; }
    public DateTime DueDate { get; set; }
    public WorkoutTaskStatus Status { get; set; }
    public int WorkoutPlanId { get; set; }
    public string WorkoutPlanName { get; set; } = string.Empty;
    public int MemberId { get; set; }
}

public class CreateWorkoutTaskDto
{
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
    public int WorkoutPlanId { get; set; }
}

public class UpdateWorkoutTaskDto
{
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
    public WorkoutTaskStatus Status { get; set; }
}

public class UpdateWorkoutTaskStatusDto
{
    [Required]
    public WorkoutTaskStatus Status { get; set; }
}