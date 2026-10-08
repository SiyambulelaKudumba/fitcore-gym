import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import memberService from '../services/memberService';

const MemberDashboard = () => {
  const [programme, setProgramme] = useState(null);
  const [planCount, setPlanCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch everything in parallel — faster than one-by-one
        const [programmeData, plans, tasks] = await Promise.all([
          memberService.getMyProgramme(),
          memberService.getMyPlans(),
          memberService.getMyTasks(),
        ]);
        setProgramme(programmeData);
        setPlanCount(plans.length);
        setTaskCount(tasks.length);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Member Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Current Programme</Card.Title>
                  <Card.Text className="fs-4">
                    {programme ? programme.name : 'None'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Workout Plans</Card.Title>
                  <Card.Text className="fs-4">{planCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Workout Tasks</Card.Title>
                  <Card.Text className="fs-4">{taskCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>My Programme</Card.Title>
                  <Card.Text>View your assigned training programme.</Card.Text>
                  <Link to="/member/programme" className="btn btn-primary">
                    View Programme
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>My Plans</Card.Title>
                  <Card.Text>See the workout plans created for you.</Card.Text>
                  <Link to="/member/plans" className="btn btn-primary">
                    View Plans
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>My Tasks</Card.Title>
                  <Card.Text>Track and update your workout tasks.</Card.Text>
                  <Link to="/member/tasks" className="btn btn-primary">
                    View Tasks
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

export default MemberDashboard;