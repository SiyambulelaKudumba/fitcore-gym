# Entities

All entities live in `backend/FitCore.Api/Models/`.
EF Core Code-First generates the tables from these classes.

## ApplicationUser : IdentityUser
| Field | Type | Notes |
|-------|------|-------|
| Id | string | Inherited from IdentityUser |
| Email | string | Inherited |
| PasswordHash | string | Inherited |
| FirstName | string | Required, max 50 |
| LastName | string | Required, max 50 |
| Role | UserRole | Admin / Member / Trainer |
| MemberId | int? | Optional link to Member |
| TrainerId | int? | Optional link to Trainer |

## Member
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| MemberNumber | string | Required, unique, max 20. Auto-generated if not supplied (e.g. M0001). |
| FirstName | string | Required, max 50 |
| LastName | string | Required, max 50 |
| Gender | Gender | Required |
| DateOfBirth | DateTime | Required |
| HomeAddress | string | Required, max 200 |
| Email | string | Required, email format, unique |
| PhoneNumber | string? | Optional, max 15 |
| MembershipType | MembershipType | Monthly / Quarterly / Annual |
| JoinDate | DateTime | Defaults to today |
| TrainerId | int? | Foreign key to Trainer |
| TrainingProgrammeId | int? | Foreign key to TrainingProgramme |
| UserId | string? | Foreign key to ApplicationUser |

## Trainer
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| StaffNumber | string | Required, unique, max 20. Auto-generated if not supplied (e.g. T0001). |
| FirstName | string | Required, max 50 |
| LastName | string | Required, max 50 |
| Gender | Gender | Required |
| Email | string | Required, email format, unique |
| PhoneNumber | string? | Optional, max 15 |
| Specialization | Specialization | Required |
| UserId | string? | Foreign key to ApplicationUser |

## TrainingProgramme
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| Name | string | Required, max 100 |
| Description | string? | Optional, max 500 |
| Duration | string | Required, max 50, e.g. "12 weeks" |
| FitnessGoal | FitnessGoal | Required |

## WorkoutPlan
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| Name | string | Required, max 100 |
| Description | string? | Optional, max 500 |
| MemberId | int | Foreign key to Member |
| TrainerId | int | Foreign key to Trainer |
| TrainingProgrammeId | int | Foreign key to TrainingProgramme |
| CreatedDate | DateTime | Defaults to today |

## WorkoutTask
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key, auto-generated |
| ExerciseName | string | Required, max 100 |
| Description | string? | Optional, max 500 |
| NumberOfSets | int | Required, 1–20 |
| NumberOfRepetitions | int | Required, 1–100 |
| DueDate | DateTime | Required |
| Status | WorkoutTaskStatus | NotStarted / InProgress / Complete |
| WorkoutPlanId | int | Foreign key to WorkoutPlan |

## Relationships
- ApplicationUser 1 ── 0..1 Member
- ApplicationUser 1 ── 0..1 Trainer
- Trainer 1 ── * Member
- TrainingProgramme 1 ── * Member
- TrainingProgramme 1 ── * WorkoutPlan
- Member 1 ── * WorkoutPlan
- Trainer 1 ── * WorkoutPlan
- WorkoutPlan 1 ── * WorkoutTask