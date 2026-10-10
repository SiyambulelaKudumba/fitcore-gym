using System.ComponentModel.DataAnnotations;
using FitCore.Api.Models;

namespace FitCore.Api.DTOs;

public class TrainerDto
{
    public int Id { get; set; }
    public string StaffNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public Specialization Specialization { get; set; }
}

public class CreateTrainerDto
{
    [StringLength(20)]
    public string? StaffNumber { get; set; } // Auto-generated if null

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
}