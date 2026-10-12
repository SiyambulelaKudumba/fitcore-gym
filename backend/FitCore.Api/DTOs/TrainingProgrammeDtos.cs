using System.ComponentModel.DataAnnotations;
using FitCore.Api.Models;

namespace FitCore.Api.DTOs;

public class TrainingProgrammeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Duration { get; set; } = string.Empty;
    public FitnessGoal FitnessGoal { get; set; }
}

public class CreateTrainingProgrammeDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required, StringLength(50)]
    public string Duration { get; set; } = string.Empty;

    [Required]
    public FitnessGoal FitnessGoal { get; set; }
}