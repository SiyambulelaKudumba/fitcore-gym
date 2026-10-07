Seed Data

Created on first run by DbSeeder in backend/FitCore.Api/Data/.
These are the default rows inserted when the database is empty.

## Users
| Email | Password | Role |
|-------|----------|------|
| admin@fitcore.co.za | Admin@123 | Admin |
| member@fitcore.co.za | Member@123 | Member |
| trainer@fitcore.co.za | Trainer@123 | Trainer |
| sarah@fitcore.co.za | Member@123 | Member |
| aisha@fitcore.co.za | Trainer@123 | Trainer |

## Members
| Id | MemberNumber | FirstName | LastName | Gender | DateOfBirth | HomeAddress | Email | Phone | MembershipType | TrainerId | TrainingProgrammeId |
|----|--------------|-----------|----------|--------|-------------|-------------|-------|-------|----------------|-----------|---------------------|
| 1 | M0001 | Test | Member | Male | 1990-01-01 | 123 Main St | member@fitcore.co.za | 0821234567 | Monthly | 1 | 1 |
| 2 | M0002 | Sarah | Naidoo | Female | 1992-05-15 | 45 Oak Ave | sarah@fitcore.co.za | 0839876543 | Quarterly | 2 | 2 |

## Trainers
| Id | StaffNumber | FirstName | LastName | Gender | Email | Phone | Specialization |
|----|-------------|-----------|----------|--------|-------|-------|----------------|
| 1 | T0001 | Thabo | Mokoena | Male | thabo@fitcore.co.za | 0711111111 | StrengthAndConditioning |
| 2 | T0002 | Aisha | Patel | Female | aisha@fitcore.co.za | 0722222222 | GeneralFitness |

## Training Programmes
| Id | Name | Description | Duration | FitnessGoal |
|----|------|-------------|----------|-------------|
| 1 | Weight Loss | Fat loss and cardio plan | 12 weeks | WeightLoss |
| 2 | Muscle Building | Hypertrophy focused plan | 8 weeks | MuscleBuilding |
| 3 | General Fitness | Balanced fitness plan | 6 weeks | GeneralFitness |

## Workout Plans
| Id | Name | MemberId | TrainerId | TrainingProgrammeId | CreatedDate |
|----|------|----------|-----------|---------------------|-------------|
| 1 | Test Member Weight Loss Plan | 1 | 1 | 1 | 2026-10-06 |
| 2 | Sarah Muscle Building Plan | 2 | 2 | 2 | 2026-10-06 |

## Workout Tasks
| Id | ExerciseName | Description | Sets | Reps | DueDate | Status | WorkoutPlanId |
|----|--------------|-------------|------|------|---------|--------|---------------|
| 1 | Treadmill Run | Run at moderate pace | 1 | 1 | 2026-10-15 | NotStarted | 1 |
| 2 | Squats | Keep back straight | 3 | 12 | 2026-10-16 | InProgress | 1 |
| 3 | Plank | Hold for 60 seconds | 3 | 1 | 2026-10-17 | Complete | 1 |
| 4 | Bench Press | Warm up first | 4 | 8 | 2026-10-18 | NotStarted | 2 |

## Notes
- Test member has tasks in all three statuses to test filtering.
- Use member@fitcore.co.za / Member@123 to test member dashboard.
- Use trainer@fitcore.co.za / Trainer@123 to test trainer dashboard.
- Use admin@fitcore.co.za / Admin@123 to test admin dashboard.