import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const links = [
    { to: "/admin/members", label: "Manage Members" },
    { to: "/admin/trainers", label: "Manage Trainers" },
    { to: "/admin/programmes", label: "Manage Programmes" },
    { to: "/admin/users", label: "Users by Type" },
    { to: "/workoutplans", label: "Workout Plans" },
    { to: "/workouttasks", label: "Workout Tasks" },
  ];

  return (
    <Container className="page-container">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        {links.map((link) => (
          <Col md={4} key={link.to} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <Card.Title>{link.label}</Card.Title>
                <Button as={Link} to={link.to} variant="primary">Open</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}