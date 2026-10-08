import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import trainerService from '../services/trainerService';
import workoutPlanService from '../services/workoutPlanService';

const TrainerDashboard = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [planCount, setPlanCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [members, plans] = await Promise.all([
          trainerService.getMyMembers(),
          workoutPlanService.getMyPlans(),
        ]);
        setMemberCount(members.length);
        setPlanCount(plans.length);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Trainer Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={6}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Assigned Members</Card.Title>
                  <Card.Text className="fs-3">{memberCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>My Workout Plans</Card.Title>
                  <Card.Text className="fs-3">{planCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>My Members</Card.Title>
                  <Card.Text>View the members assigned to you.</Card.Text>
                  <Link to="/trainer/members" className="btn btn-primary">
                    View Members
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Workout Plans</Card.Title>
                  <Card.Text>Create and manage workout plans.</Card.Text>
                  <Link to="/trainer/plans" className="btn btn-primary">
                    Manage Plans
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Workout Tasks</Card.Title>
                  <Card.Text>Create and manage exercises in plans.</Card.Text>
                  <Link to="/trainer/tasks" className="btn btn-primary">
                    Manage Tasks
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default TrainerDashboard;