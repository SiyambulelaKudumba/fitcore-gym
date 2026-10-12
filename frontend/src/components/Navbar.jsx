import { Link, useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          FitCore Gym
        </BSNavbar.Brand>
        <BSNavbar.Toggle />
        <BSNavbar.Collapse>
          <Nav className="me-auto">
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}

            {user?.role === "Admin" && (
              <>
                <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/members">Members</Nav.Link>
                <Nav.Link as={Link} to="/admin/trainers">Trainers</Nav.Link>
                <Nav.Link as={Link} to="/admin/programmes">Programmes</Nav.Link>
                <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                <Nav.Link as={Link} to="/workoutplans">Workout Plans</Nav.Link>
                <Nav.Link as={Link} to="/workouttasks">Workout Tasks</Nav.Link>
              </>
            )}

            {user?.role === "Trainer" && (
              <>
                <Nav.Link as={Link} to="/trainer">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/trainer/members">My Members</Nav.Link>
                <Nav.Link as={Link} to="/trainer/plans">Workout Plans</Nav.Link>
                <Nav.Link as={Link} to="/trainer/tasks">Workout Tasks</Nav.Link>
              </>
            )}

            {user?.role === "Member" && (
              <>
                <Nav.Link as={Link} to="/member">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/member/programme">My Programme</Nav.Link>
                <Nav.Link as={Link} to="/member/plans">My Plans</Nav.Link>
                <Nav.Link as={Link} to="/member/tasks">My Tasks</Nav.Link>
              </>
            )}
          </Nav>
          {isLoggedIn && (
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout ({user?.firstName} {user?.lastName})
            </Button>
          )}
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}