using System.ComponentModel.DataAnnotations;

namespace FitCore.Api.Models;

public class TrainingProgramme
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required, StringLength(50)]
    public string Duration { get; set; } = string.Empty;

    [Required]
    public FitnessGoal FitnessGoal { get; set; }

    public ICollection<Member> Members { get; set; } = new List<Member>();
    public ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();
}