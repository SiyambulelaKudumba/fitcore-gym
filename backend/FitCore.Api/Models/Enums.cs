namespace FitCore.Api.Models;

public enum UserRole
{
    Admin,
    Member,
    Trainer
}

public enum Gender
{
    Male,
    Female,
    Other,
    PreferNotToSay
}

public enum MembershipType
{
    Monthly,
    Quarterly,
    Annual
}

public enum Specialization
{
    WeightTraining,
    Cardio,
    StrengthAndConditioning,
    GeneralFitness,
    WeightLoss
}

public enum FitnessGoal
{
    WeightLoss,
    MuscleBuilding,
    GeneralFitness,
    Strength,
    Endurance
}

public enum WorkoutTaskStatus
{
    NotStarted,
    InProgress,
    Complete
}