using System.ComponentModel.DataAnnotations;

namespace FitCore.Api.Models;

public class WorkoutPlan
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public int MemberId { get; set; }
    public Member Member { get; set; } = null!;

    [Required]
    public int TrainerId { get; set; }
    public Trainer Trainer { get; set; } = null!;

    [Required]
    public int TrainingProgrammeId { get; set; }
    public TrainingProgramme TrainingProgramme { get; set; } = null!;

    public DateTime CreatedDate { get; set; } = DateTime.Today;

    public ICollection<WorkoutTask> WorkoutTasks { get; set; } = new List<WorkoutTask>();
}