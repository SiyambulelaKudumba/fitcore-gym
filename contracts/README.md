# Contract Freeze – FitCore Gym Management System

**Frozen on:** 6 October 2026  
**Updated:** 8 October 2026 (consistency fixes)

This folder contains the agreed contracts for the entire project.
All backend and frontend work must be built against these contracts.

## Rules
- Do not change any file in this folder without group agreement.
- If a change is required, create a pull request, tag all members, and update the contract before changing code.
- Use the API contract table as the single source of truth for routes, roles, request bodies, and response bodies.
- Use the DTO definitions exactly as written. Do not add or remove properties without updating this contract.

## Contents
- `entities.md` – C# entity classes
- `enums.md` – C# enum definitions
- `dtos.md` – C# DTO classes
- `api-contract.md` – API routes, roles, requests, responses
- `auth-contract.md` – Login, register, JWT claims, seed users
- `react-routes.md` – Frontend route map and role access
- `shared-components.md` – Props for shared React components and ownership
- `error-format.md` – Standard API error response
- `seed-data.md` – Initial seed data