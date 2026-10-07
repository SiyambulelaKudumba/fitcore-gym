Shared Components

Location: frontend/src/components/.

## Navbar
<Navbar />
No props. Reads user and role from localStorage.

## ProtectedRoute
<ProtectedRoute roles={["Admin", "Trainer", "Member"]}>
  <SomePage />
</ProtectedRoute>

| Prop | Type | Notes |
|------|------|-------|
| roles | string[] | Empty array = any logged-in user |
| children | node | The page to render |

## LoadingSpinner
<LoadingSpinner />
No props.

## ErrorAlert
<ErrorAlert message="Could not load data." onClose={() => setError("")} />

| Prop | Type | Notes |
|------|------|-------|
| message | string | Empty = don't render |
| onClose | function | Optional |

## Who owns what
| Owner | Files |
|-------|-------|
| M3 | Navbar.js, ProtectedRoute.js, LoadingSpinner.js, ErrorAlert.js |
| M3 | App.js, index.js, LoginPage.js, RegisterPage.js, HomePage.js |
| M3 | services/api.js |
| M4 | MembersPage.jsx, TrainersPage.jsx, ProgrammesPage.jsx |
| M4 | TrainerMembersPage.jsx, TrainerPlansPage.jsx, TrainerTasksPage.jsx |
| M4 | MemberProgrammePage.jsx, MemberPlansPage.jsx, MemberTasksPage.jsx |
| M4 | services/memberService.js, trainerService.js, programmeService.js, workoutPlanService.js, workoutTaskService.js |
| M4 | everything in /docs |

## Rule
If M4 needs a new route or a change to Navbar, M4 sends the exact lines to M3. M4 never edits M3's files.