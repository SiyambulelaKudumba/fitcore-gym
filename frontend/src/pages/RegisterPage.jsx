import { useState } from "react";
import { Container, Card, Form as BSForm, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ErrorAlert from "../components/ErrorAlert";

const initialForm = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  gender: "Male",
  dateOfBirth: "",
  homeAddress: "",
  phoneNumber: "",
  membershipType: "Monthly",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      const user = await login(form.email, form.password);
      const dashboards = { Admin: "/admin", Trainer: "/trainer", Member: "/member" };
      navigate(dashboards[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <Container>
      <Card className="auth-card shadow" style={{ maxWidth: 600 }}>
        <Card.Body>
          <h3 className="text-center mb-4">Register as a Member</h3>
          <ErrorAlert message={error} onClose={() => setError("")} />
          <BSForm onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <BSForm.Group className="mb-3">
                  <BSForm.Label>First Name</BSForm.Label>
                  <BSForm.Control name="firstName" value={form.firstName} onChange={handleChange} required />
                </BSForm.Group>
              </Col>
              <Col md={6}>
                <BSForm.Group className="mb-3">
                  <BSForm.Label>Last Name</BSForm.Label>
                  <BSForm.Control name="lastName" value={form.lastName} onChange={handleChange} required />
                </BSForm.Group>
              </Col>
            </Row>
            <BSForm.Group className="mb-3">
              <BSForm.Label>Email</BSForm.Label>
              <BSForm.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </BSForm.Group>
            <BSForm.Group className="mb-3">
              <BSForm.Label>Password</BSForm.Label>
              <BSForm.Control type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
            </BSForm.Group>
            <Row>
              <Col md={6}>
                <BSForm.Group className="mb-3">
                  <BSForm.Label>Gender</BSForm.Label>
                  <BSForm.Select name="gender" value={form.gender} onChange={handleChange}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>PreferNotToSay</option>
                  </BSForm.Select>
                </BSForm.Group>
              </Col>
              <Col md={6}>
                <BSForm.Group className="mb-3">
                  <BSForm.Label>Date of Birth</BSForm.Label>
                  <BSForm.Control type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />
                </BSForm.Group>
              </Col>
            </Row>
            <BSForm.Group className="mb-3">
              <BSForm.Label>Home Address</BSForm.Label>
              <BSForm.Control name="homeAddress" value={form.homeAddress} onChange={handleChange} required />
            </BSForm.Group>
            <Row>
              <Col md={6}>
                <BSForm.Group className="mb-3">
                  <BSForm.Label>Phone (optional)</BSForm.Label>
                  <BSForm.Control name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                </BSForm.Group>
              </Col>
              <Col md={6}>
                <BSForm.Group className="mb-3">
                  <BSForm.Label>Membership Type</BSForm.Label>
                  <BSForm.Select name="membershipType" value={form.membershipType} onChange={handleChange}>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annual</option>
                  </BSForm.Select>
                </BSForm.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100">Register</Button>
          </BSForm>
        </Card.Body>
      </Card>
    </Container>
  );
}