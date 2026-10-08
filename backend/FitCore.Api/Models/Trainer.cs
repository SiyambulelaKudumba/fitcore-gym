using System.ComponentModel.DataAnnotations;

namespace FitCore.Api.Models;

public class Trainer
{
    public int Id { get; set; }

    [Required, StringLength(20)]
    public string StaffNumber { get; set; } = string.Empty;

    [Required, StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required, StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public Gender Gender { get; set; }

    [Required, EmailAddress, StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Phone, StringLength(15)]
    public string? PhoneNumber { get; set; }

    [Required]
    public Specialization Specialization { get; set; }

    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public ICollection<Member> Members { get; set; } = new List<Member>();
    public ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();
}