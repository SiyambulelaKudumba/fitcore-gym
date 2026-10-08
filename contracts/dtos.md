using System.ComponentModel.DataAnnotations;

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

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

    [Phone, StringLength(15)]
    public string? PhoneNumber { get; set; }

    [Required]
    public MembershipType MembershipType { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? MemberId { get; set; }
    public int? TrainerId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

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