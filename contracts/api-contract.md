API Contract
Base URL (dev): https://localhost:7001/api

All protected endpoints require header: Authorization: Bearer <token>
Roles: Public = no token | Member | Admin | Trainer

## Auth
| Method | Route | Role | Request | Response |
|--------|-------|------|---------|----------|
| POST | /auth/register | Public | RegisterDto | 200 AuthResponseDto |
| POST | /auth/login | Public | LoginDto | 200 AuthResponseDto |
| GET | /auth/me | Any logged-in | - | 200 UserDto |

## Members
| Method | Route | Role | Request | Response |
|--------|-------|------|---------|----------|
| GET | /members | Admin | ?search=&searchBy=memberNumber\|name\|surname | 200 MemberDto[] |
| GET | /members/{id} | Admin, Member (own) | - | 200 MemberDto / 404 |
| POST | /members | Admin | CreateMemberDto | 201 MemberDto / 400 |
| PUT | /members/{id} | Admin | CreateMemberDto | 200 MemberDto / 400 |
| DELETE | /members/{id} | Admin | - | 204 / 404 |
| PUT | /members/{id}/trainer | Admin | AssignTrainerDto | 200 MemberDto / 400 |
| PUT | /members/{id}/programme | Admin | AssignProgrammeDto | 200 MemberDto / 400 |
| GET | /members/me | Member | - | 200 MemberDto |
| GET | /members/me/programme | Member | - | 200 TrainingProgrammeDto / 404 |
| GET | /members/me/workoutplans | Member | - | 200 WorkoutPlanDto[] |
| GET | /members/me/workouttasks | Member | ?status=NotStarted\|InProgress\|Complete | 200 WorkoutTaskDto[] |

## Trainers
| Method | Route | Role | Request | Response |
|--------|-------|------|---------|----------|
| GET | /trainers | Admin, Member | ?search=&searchBy=staffNumber\|name\|surname | 200 TrainerDto[] |
| GET | /trainers/{id} | Admin, Member | - | 200 TrainerDto / 404 |
| POST | /trainers | Admin | CreateTrainerDto | 201 TrainerDto / 400 |
| PUT | /trainers/{id} | Admin | CreateTrainerDto | 200 TrainerDto / 400 |
| DELETE | /trainers/{id} | Admin | - | 204 / 404 |
| GET | /trainers/me/members | Trainer | - | 200 MemberDto[] |
| GET | /trainers/me/members/{memberId}/programmes | Trainer | - | 200 TrainingProgrammeDto[] |
| GET | /trainers/me/workoutplans | Trainer | - | 200 WorkoutPlanDto[] |

## Training Programmes
| Method | Route | Role | Request | Response |
|--------|-------|------|---------|----------|
| GET | /programmes | Admin, Trainer, Member | - | 200 TrainingProgrammeDto[] |
| GET | /programmes/{id} | Admin, Trainer, Member | - | 200 TrainingProgrammeDto / 404 |
| POST | /programmes | Admin | CreateTrainingProgrammeDto | 201 TrainingProgrammeDto / 400 |
| PUT | /programmes/{id} | Admin | CreateTrainingProgrammeDto | 200 TrainingProgrammeDto / 400 |
| DELETE | /programmes/{id} | Admin | - | 204 / 404 |

## Workout Plans
| Method | Route | Role | Request | Response |
|--------|-------|------|---------|----------|
| GET | /workoutplans | Admin | - | 200 WorkoutPlanDto[] |
| GET | /workoutplans/{id} | Admin, Trainer, Member (own) | - | 200 WorkoutPlanDto / 404 |
| POST | /workoutplans | Trainer, Admin | CreateWorkoutPlanDto | 201 WorkoutPlanDto / 400 |
| PUT | /workoutplans/{id} | Trainer, Admin | CreateWorkoutPlanDto | 200 WorkoutPlanDto / 400 |
| DELETE | /workoutplans/{id} | Trainer, Admin | - | 204 / 404 |
| GET | /workoutplans/member/{memberId} | Admin, Trainer (assigned), Member (own) | - | 200 WorkoutPlanDto[] |
| GET | /workoutplans/trainer/me | Trainer | - | 200 WorkoutPlanDto[] |

## Workout Tasks
| Method | Route | Role | Request | Response |
|--------|-------|------|---------|----------|
| GET | /workouttasks/plan/{planId} | Admin, Trainer, Member (own) | ?status=NotStarted\|InProgress\|Complete | 200 WorkoutTaskDto[] |
| GET | /workouttasks/{id} | Admin, Trainer, Member (own) | - | 200 WorkoutTaskDto / 404 |
| POST | /workouttasks | Trainer, Admin | CreateWorkoutTaskDto | 201 WorkoutTaskDto / 400 |
| PUT | /workouttasks/{id} | Trainer, Admin | UpdateWorkoutTaskDto | 200 WorkoutTaskDto / 400 |
| DELETE | /workouttasks/{id} | Trainer, Admin | - | 204 / 404 |
| PATCH | /workouttasks/{id}/status | Member (own), Trainer, Admin | UpdateWorkoutTaskStatusDto | 200 WorkoutTaskDto / 400 |

## Status codes
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request (validation)
- 401 Unauthorized (no/invalid token)
- 403 Forbidden (wrong role)
- 404 Not Found
- 409 Conflict (already assigned / duplicate)