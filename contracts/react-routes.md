React Routes

| Path | Component | Access | Notes |
|------|-----------|--------|-------|
| / | HomePage | Public | Landing page |
| /login | LoginPage | Public | Redirects to role dashboard if logged in |
| /register | RegisterPage | Public | Creates a Member |
| /admin | AdminDashboard | Admin | Admin summary |
| /trainer | TrainerDashboard | Trainer | Trainer summary |
| /member | MemberDashboard | Member | Member summary |
| /admin/members | MembersPage | Admin | Manage members + search |
| /admin/trainers | TrainersPage | Admin | Manage trainers + search |
| /admin/programmes | ProgrammesPage | Admin | Manage training programmes |
| /trainer/members | TrainerMembersPage | Trainer | View assigned members |
| /trainer/plans | TrainerPlansPage | Trainer | Create/manage workout plans |
| /trainer/tasks | TrainerTasksPage | Trainer | Create/manage workout tasks |
| /member/programme | MemberProgrammePage | Member | View assigned programme |
| /member/plans | MemberPlansPage | Member | View own workout plans |
| /member/tasks | MemberTasksPage | Member | View tasks, update status, filter |
| /member/tasks?status=InProgress | MemberTasksPage | Member | Filter by status |
| /programmes | ProgrammesPage | Admin, Trainer, Member | View programmes |
| /workoutplans | WorkoutPlansPage | Admin, Trainer, Member | View workout plans |
| /workouttasks | WorkoutTasksPage | Admin, Trainer, Member | View workout tasks |
| * | NotFoundPage | Public | 404 |

## Guard rules
- If not logged in, redirect to /login
- If logged in but wrong role, redirect to their dashboard with a message
- ProtectedRoute component wraps role-restricted routes:

<ProtectedRoute roles={["Admin"]}>
  <MembersPage />
</ProtectedRoute>

## Navbar links by role
- Public: Home, Login, Register
- Member: Dashboard, My Programme, My Plans, My Tasks, Logout
- Trainer: Dashboard, My Members, Workout Plans, Workout Tasks, Logout
- Admin: Dashboard, Members, Trainers, Programmes, Workout Plans, Logout

## Routes to add in App.js
<Route path="/admin/members" element={<MembersPage />} />
<Route path="/admin/trainers" element={<TrainersPage />} />
<Route path="/admin/programmes" element={<ProgrammesPage />} />
<Route path="/trainer/members" element={<TrainerMembersPage />} />
<Route path="/trainer/plans" element={<TrainerPlansPage />} />
<Route path="/trainer/tasks" element={<TrainerTasksPage />} />
<Route path="/member/programme" element={<MemberProgrammePage />} />
<Route path="/member/plans" element={<MemberPlansPage />} />
<Route path="/member/tasks" element={<MemberTasksPage />} />