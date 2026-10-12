import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container className="mt-4">
      <div className="text-center mb-5">
        <h1>FitCore Gym Management System</h1>
        <p className="text-muted">ITP2020 Assignment 2 — Group Project (Option A)</p>
      </div>

      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header className="bg-primary text-white"><strong>Member Role</strong></Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/member">Member Dashboard</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/member/programme">My Programme</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/member/plans">My Workout Plans</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/member/tasks">My Workout Tasks</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Header className="bg-success text-white"><strong>Trainer Role</strong></Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/trainer">Trainer Dashboard</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/trainer/members">My Members</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/trainer/plans">My Workout Plans</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/trainer/tasks">Workout Tasks</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Header className="bg-dark text-white"><strong>Admin Role</strong></Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action as={Link} to="/admin">Admin Dashboard</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/admin/members">Manage Members</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/admin/trainers">Manage Trainers</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/admin/programmes">Manage Programmes</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/admin/users">Users by Type</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="bg-secondary text-white"><strong>Shared Views</strong></Card.Header>
            <ListGroup variant="flush" horizontal className="flex-wrap">
              <ListGroup.Item action as={Link} to="/workoutplans">All Workout Plans</ListGroup.Item>
              <ListGroup.Item action as={Link} to="/workouttasks">All Workout Tasks</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;