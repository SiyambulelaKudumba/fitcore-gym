# FitCore Gym Management System

ITP2020 Assignment 2 – Group Project (Option A)

## Tech Stack

- **Backend:** ASP.NET Core 8 Web API, EF Core (Code-First), SQL Server
- **Frontend:** React, React-Bootstrap
- **Auth:** ASP.NET Identity + JWT
- **Database:** Microsoft SQL Server

## Group Members

**Group Name:** FitCore Gym Team

| Name                          | Student Number | Role                            |                |
|-------------------------------|----------------|--------------------------------|                |
| Tristan Zeta Hayhurst         | s231156669     | M1 – Backend Lead                            |                |
| Justin Christopher Agnew      | s229355595     | M2 – Backend Features                        |                |
| Jayden Ronaldo Agnew          | 229356184      | M3 – Frontend Lead                            |                |
| Siyambulela Tapiwa Kudumba    | s232094217     | M4 – Frontend Features + Docs                 |                |

## Roles

- **Admin** — Manages members, trainers, and programmes; assigns trainers to members; assigns members to programmes; lists users by type.
- **Trainer** — Views assigned members and their programmes; creates and manages workout plans and tasks.
- **Member** — Views assigned programme, plans, and tasks; updates task status; filters tasks by status.

## Getting Started

### Backend

```bash
cd Backend/FitCore.Api
dotnet run