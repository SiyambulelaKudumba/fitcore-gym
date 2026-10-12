using System.ComponentModel.DataAnnotations;
using FitCore.Api.Models;

namespace FitCore.Api.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public string MemberNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string HomeAddress { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public MembershipType MembershipType { get; set; }
    public DateTime JoinDate { get; set; }
    public int? TrainerId { get; set; }
    public string? TrainerName { get; set; }
    public int? TrainingProgrammeId { get; set; }
    public string? TrainingProgrammeName { get; set; }
}

public class CreateMemberDto
{
    [StringLength(20)]
    public string? MemberNumber { get; set; } // Auto-generated if null

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

    public int? TrainerId { get; set; }
    public int? TrainingProgrammeId { get; set; }
}

public class AssignTrainerDto
{
    [Required]
    public int TrainerId { get; set; }
}

public class AssignProgrammeDto
{
    [Required]
    public int TrainingProgrammeId { get; set; }
}