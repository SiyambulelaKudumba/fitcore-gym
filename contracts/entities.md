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

## Member
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| FirstName | string | Required, max 50 |
| LastName | string | Required, max 50 |
| Email | string | Required, email format, unique |
| PhoneNumber | string | Optional, max 15 |
| JoinDate | DateTime | Defaults to today |
| UserId | string | Foreign key to ApplicationUser |

## Trainer
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| FirstName | string | Required, max 50 |
| LastName | string | Required, max 50 |
| Email | string | Required, email format |
| Speciality | string | Optional, max 100 |

## GymClass
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| Name | string | Required, max 50 |
| TrainerId | int | Foreign key to Trainer |
| Day | string | Monday–Saturday |
| Time | string | "HH:mm" format, e.g. "18:00" |
| Capacity | int | 1–50 |
| Booked | int | Count of active bookings |

## Booking
| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| MemberId | int | Foreign key to Member |
| ClassId | int | Foreign key to GymClass |
| BookingDate | DateTime | Defaults to today |
| Status | BookingStatus | Booked / Cancelled / Attended |

## Relationships
- ApplicationUser 1 ── 1 Member
- Trainer 1 ── * GymClass
- Member 1 ── * Booking
- GymClass 1 ── * Booking