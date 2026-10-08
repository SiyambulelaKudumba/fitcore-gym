import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MemberDashboard from './pages/MemberDashboard';
import MemberTasksPage from './pages/MemberTasksPage';
import MemberPlansPage from './pages/MemberPlansPage';
import MemberProgrammePage from './pages/MemberProgrammePage';
import TrainerDashboard from './pages/TrainerDashboard';
import TrainerMembersPage from './pages/TrainerMembersPage';
import TrainerPlansPage from './pages/TrainerPlansPage';
import TrainerTasksPage from './pages/TrainerTasksPage';
import AdminDashboard from './pages/AdminDashboard';
import TrainersPage from './pages/TrainersPage';
import ProgrammesPage from './pages/ProgrammesPage';
import UsersByTypePage from './pages/UsersByTypePage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import WorkoutTasksPage from './pages/WorkoutTasksPage';
import MembersPage from './pages/MembersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/tasks" element={<MemberTasksPage />} />
        <Route path="/member/plans" element={<MemberPlansPage />} />
        <Route path="/member/programme" element={<MemberProgrammePage />} />

        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/trainer/members" element={<TrainerMembersPage />} />
        <Route path="/trainer/plans" element={<TrainerPlansPage />} />
        <Route path="/trainer/tasks" element={<TrainerTasksPage />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/members" element={<MembersPage />} />
        <Route path="/admin/trainers" element={<TrainersPage />} />
        <Route path="/admin/programmes" element={<ProgrammesPage />} />
        <Route path="/admin/users" element={<UsersByTypePage />} />

        <Route path="/workoutplans" element={<WorkoutPlansPage />} />
        <Route path="/workouttasks" element={<WorkoutTasksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;