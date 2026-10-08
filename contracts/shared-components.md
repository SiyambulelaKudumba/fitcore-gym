Shared Components

Location: frontend/src/components/.

All components are JavaScript (.jsx for components, .js for services).
No TypeScript. No type annotations.

## Navbar
<Navbar />
No props. Reads user and role from localStorage.

## ProtectedRoute
<ProtectedRoute roles={["Admin", "Trainer", "Member"]}>
  <SomePage />
</ProtectedRoute>

| Prop | Type | Notes |
|------|------|-------|
| roles | array of strings | Empty array = any logged-in user |
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

## Table
<Table columns={columns} data={data} keyField="id" actions={actions} />

| Prop | Type | Notes |
|------|------|-------|
| columns | array of objects | Each object: { key, label, render? } |
| data | array | Rows |
| keyField | string | Unique field for React key |
| actions | function | Optional. Receives row, returns JSX |

## Form
<Form onSubmit={handleSubmit} error={error} />

| Prop | Type | Notes |
|------|------|-------|
| onSubmit | function | Form submit handler |
| error | string | Top-level error message |
| children | node | Form fields |

## Modal
<Modal show={show} title="Edit" onClose={handleClose} onSave={handleSave} />

| Prop | Type | Notes |
|------|------|-------|
| show | boolean | Visibility |
| title | string | Modal title |
| onClose | function | Close handler |
| onSave | function | Save handler |
| children | node | Modal body |

## Who owns what
| Owner | Files |
|-------|-------|
| M3 | Navbar.jsx, ProtectedRoute.jsx, LoadingSpinner.jsx, ErrorAlert.jsx, Table.jsx, Form.jsx, Modal.jsx |
| M3 | App.jsx, index.js, LoginPage.jsx, RegisterPage.jsx, HomePage.jsx |
| M3 | services/api.js |
| M4 | MembersPage.jsx, TrainersPage.jsx, ProgrammesPage.jsx, UsersByTypePage.jsx |
| M4 | AdminDashboard.jsx, TrainerDashboard.jsx, MemberDashboard.jsx |
| M4 | TrainerMembersPage.jsx, TrainerPlansPage.jsx, TrainerTasksPage.jsx |
| M4 | MemberProgrammePage.jsx, MemberPlansPage.jsx, MemberTasksPage.jsx |
| M4 | WorkoutPlansPage.jsx, WorkoutTasksPage.jsx |
| M4 | services/memberService.js, trainerService.js, programmeService.js, workoutPlanService.js, workoutTaskService.js |
| M4 | everything in /docs |

## Rule
If M4 needs a new route or a change to Navbar, M4 sends the exact lines to M3. M4 never edits M3's files.