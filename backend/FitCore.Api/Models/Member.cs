using System.ComponentModel.DataAnnotations;

namespace FitCore.Api.Models;

public class Member
{
    public int Id { get; set; }

    [Required, StringLength(20)]
    public string MemberNumber { get; set; } = string.Empty;

    [Required, StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required, StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public Gender Gender { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required, StringLength(200)]
    public string HomeAddress { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Phone, StringLength(15)]
    public string? PhoneNumber { get; set; }

    [Required]
    public MembershipType MembershipType { get; set; }

    public DateTime JoinDate { get; set; } = DateTime.Today;

    public int? TrainerId { get; set; }
    public Trainer? Trainer { get; set; }

    public int? TrainingProgrammeId { get; set; }
    public TrainingProgramme? TrainingProgramme { get; set; }

    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();
}