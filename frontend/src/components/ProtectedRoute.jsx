import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles = [], children }) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    const dashboards = {
      Admin: "/admin",
      Trainer: "/trainer",
      Member: "/member",
    };
    return <Navigate to={dashboards[user?.role] || "/"} replace />;
  }

  return children;
}