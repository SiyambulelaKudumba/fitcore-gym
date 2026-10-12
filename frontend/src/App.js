import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminDashboard from "./pages/AdminDashboard";
import MembersPage from "./pages/MembersPage";
import TrainersPage from "./pages/TrainersPage";
import ProgrammesPage from "./pages/ProgrammesPage";
import UsersByTypePage from "./pages/UsersByTypePage";

// M4 pages — import them only after M4 creates them.
// Uncomment each line as M4 finishes the file.
// import TrainerDashboard from "./pages/TrainerDashboard";
// import MemberDashboard from "./pages/MemberDashboard";
// import TrainerMembersPage from "./pages/TrainerMembersPage";
// import TrainerPlansPage from "./pages/TrainerPlansPage";
// import TrainerTasksPage from "./pages/TrainerTasksPage";
// import MemberProgrammePage from "./pages/MemberProgrammePage";
// import MemberPlansPage from "./pages/MemberPlansPage";
// import MemberTasksPage from "./pages/MemberTasksPage";
// import WorkoutPlansPage from "./pages/WorkoutPlansPage";
// import WorkoutTasksPage from "./pages/WorkoutTasksPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={
            <ProtectedRoute roles={["Admin"]}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/members" element={
            <ProtectedRoute roles={["Admin"]}><MembersPage /></ProtectedRoute>
          } />
          <Route path="/admin/trainers" element={
            <ProtectedRoute roles={["Admin"]}><TrainersPage /></ProtectedRoute>
          } />
          <Route path="/admin/programmes" element={
            <ProtectedRoute roles={["Admin"]}><ProgrammesPage /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={["Admin"]}><UsersByTypePage /></ProtectedRoute>
          } />

          {/* M4 routes — uncomment when M4's files exist.
          <Route path="/trainer" element={
            <ProtectedRoute roles={["Trainer"]}><TrainerDashboard /></ProtectedRoute>
          } />
          <Route path="/trainer/members" element={
            <ProtectedRoute roles={["Trainer"]}><TrainerMembersPage /></ProtectedRoute>
          } />
          <Route path="/trainer/plans" element={
            <ProtectedRoute roles={["Trainer"]}><TrainerPlansPage /></ProtectedRoute>
          } />
          <Route path="/trainer/tasks" element={
            <ProtectedRoute roles={["Trainer"]}><TrainerTasksPage /></ProtectedRoute>
          } />
          <Route path="/member" element={
            <ProtectedRoute roles={["Member"]}><MemberDashboard /></ProtectedRoute>
          } />
          <Route path="/member/programme" element={
            <ProtectedRoute roles={["Member"]}><MemberProgrammePage /></ProtectedRoute>
          } />
          <Route path="/member/plans" element={
            <ProtectedRoute roles={["Member"]}><MemberPlansPage /></ProtectedRoute>
          } />
          <Route path="/member/tasks" element={
            <ProtectedRoute roles={["Member"]}><MemberTasksPage /></ProtectedRoute>
          } />
          <Route path="/workoutplans" element={
            <ProtectedRoute roles={["Admin"]}><WorkoutPlansPage /></ProtectedRoute>
          } />
          <Route path="/workouttasks" element={
            <ProtectedRoute roles={["Admin"]}><WorkoutTasksPage /></ProtectedRoute>
          } />
          */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;