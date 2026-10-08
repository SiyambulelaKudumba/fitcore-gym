import { useState } from "react";
import { Container, Card, Form as BSForm, Button } from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorAlert from "../components/ErrorAlert";

export default function LoginPage() {
  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn) {
    const dashboards = { Admin: "/admin", Trainer: "/trainer", Member: "/member" };
    return <Navigate to={dashboards[user?.role] || "/"} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loggedInUser = await login(email, password);
      const dashboards = { Admin: "/admin", Trainer: "/trainer", Member: "/member" };
      navigate(dashboards[loggedInUser.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  };

  return (
    <Container>
      <Card className="auth-card shadow">
        <Card.Body>
          <h3 className="text-center mb-4">Login to FitCore</h3>
          <ErrorAlert message={error} onClose={() => setError("")} />
          <BSForm onSubmit={handleSubmit}>
            <BSForm.Group className="mb-3">
              <BSForm.Label>Email</BSForm.Label>
              <BSForm.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </BSForm.Group>
            <BSForm.Group className="mb-3">
              <BSForm.Label>Password</BSForm.Label>
              <BSForm.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </BSForm.Group>
            <Button type="submit" variant="primary" className="w-100">
              Login
            </Button>
          </BSForm>
        </Card.Body>
      </Card>
    </Container>
  );
}