# FitCore Gym Management System

ITP2020 Assignment 2 – Group Project (Option A)

## Tech Stack
- Backend: ASP.NET Core 8 Web API, EF Core (Code-First), SQL Server
- Frontend: React, React-Bootstrap
- Auth: ASP.NET Identity + JWT
- Database: Microsoft SQL Server

## Group Members
| Name | Student Number | Role |
|------|----------------|------|
|      |                | M1 – Backend Lead |
|      |                | M2 – Backend Features |
|      |                | M3 – Frontend Lead |
|      |                | M4 – Frontend Features + Docs |

## Roles
- **Admin** – manages members, trainers, programmes; assigns trainers to members and members to programmes; searches users.
- **Trainer** – views assigned members and their programmes; creates/updates workout plans and tasks.
- **Member** – views programme, plans, tasks; updates task status; filters tasks by status.

## Folder Structure
- `/contracts` – frozen API, DTO, entity, and auth contracts
- `/backend` – ASP.NET Core 8 Web API
- `/frontend` – React + React-Bootstrap app
- `/docs` – documentation, ERD, use case diagram, setup guide

## Setup
See `/docs/setup.md`.

## Due Date
12 October 2026, 23:59