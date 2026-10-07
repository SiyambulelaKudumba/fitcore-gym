public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class RegisterDto
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Gender Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string HomeAddress { get; set; }
    public string PhoneNumber { get; set; }
    public MembershipType MembershipType { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; }
    public UserDto User { get; set; }
}

public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public int? MemberId { get; set; }
    public int? TrainerId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class MemberDto
{
    public int Id { get; set; }
    public string MemberNumber { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Gender Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string HomeAddress { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public MembershipType MembershipType { get; set; }
    public DateTime JoinDate { get; set; }
    public int? TrainerId { get; set; }
    public string TrainerName { get; set; }
    public int? TrainingProgrammeId { get; set; }
    public string TrainingProgrammeName { get; set; }
}

public class CreateMemberDto
{
    public string? MemberNumber { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Gender Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string HomeAddress { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public MembershipType MembershipType { get; set; }
    public int? TrainerId { get; set; }
    public int? TrainingProgrammeId { get; set; }
}

public class TrainerDto
{
    public int Id { get; set; }
    public string StaffNumber { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Gender Gender { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Specialization Specialization { get; set; }
}

public class CreateTrainerDto
{
    public string? StaffNumber { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Gender Gender { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Specialization Specialization { get; set; }
}

public class TrainingProgrammeDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Duration { get; set; }
    public FitnessGoal FitnessGoal { get; set; }
}

public class CreateTrainingProgrammeDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Duration { get; set; }
    public FitnessGoal FitnessGoal { get; set; }
}

public class WorkoutPlanDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int MemberId { get; set; }
    public string MemberName { get; set; }
    public int TrainerId { get; set; }
    public string TrainerName { get; set; }
    public int TrainingProgrammeId { get; set; }
    public string TrainingProgrammeName { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class CreateWorkoutPlanDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int MemberId { get; set; }
    public int? TrainerId { get; set; }
    public int TrainingProgrammeId { get; set; }
}

public class WorkoutTaskDto
{
    public int Id { get; set; }
    public string ExerciseName { get; set; }
    public string Description { get; set; }
    public int NumberOfSets { get; set; }
    public int NumberOfRepetitions { get; set; }
    public DateTime DueDate { get; set; }
    public WorkoutTaskStatus Status { get; set; }
    public int WorkoutPlanId { get; set; }
    public string WorkoutPlanName { get; set; }
    public int MemberId { get; set; }
}

public class CreateWorkoutTaskDto
{
    public string ExerciseName { get; set; }
    public string Description { get; set; }
    public int NumberOfSets { get; set; }
    public int NumberOfRepetitions { get; set; }
    public DateTime DueDate { get; set; }
    public int WorkoutPlanId { get; set; }
}

public class UpdateWorkoutTaskDto
{
    public string ExerciseName { get; set; }
    public string Description { get; set; }
    public int NumberOfSets { get; set; }
    public int NumberOfRepetitions { get; set; }
    public DateTime DueDate { get; set; }
    public WorkoutTaskStatus Status { get; set; }
}

public class UpdateWorkoutTaskStatusDto
{
    public WorkoutTaskStatus Status { get; set; }
}

public class AssignTrainerDto
{
    public int TrainerId { get; set; }
}

public class AssignProgrammeDto
{
    public int TrainingProgrammeId { get; set; }
}