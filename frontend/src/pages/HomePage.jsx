import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();

  const dashboardLink = user?.role === "Admin" ? "/admin"
    : user?.role === "Trainer" ? "/trainer"
    : "/member";

  return (
    <Container className="text-center mt-5">
      <h1>FitCore Gym Management System</h1>
      <p className="lead">Manage members, trainers, programmes, and workouts.</p>
      {isLoggedIn ? (
        <Button as={Link} to={dashboardLink} variant="primary" size="lg">
          Go to Dashboard
        </Button>
      ) : (
        <>
          <Button as={Link} to="/login" variant="primary" size="lg" className="me-2">
            Login
          </Button>
          <Button as={Link} to="/register" variant="outline-primary" size="lg">
            Register
          </Button>
        </>
      )}
    </Container>
  );
}