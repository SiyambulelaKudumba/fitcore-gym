import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import memberService from '../services/memberService';
import trainerService from '../services/trainerService';
import programmeService from '../services/programmeService';

const AdminDashboard = () => {
  const [memberCount, setMemberCount] = useState(0);
  const [trainerCount, setTrainerCount] = useState(0);
  const [programmeCount, setProgrammeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [members, trainers, programmes] = await Promise.all([
          memberService.getAll(),
          trainerService.getAll(),
          programmeService.getAll(),
        ]);
        setMemberCount(members.length);
        setTrainerCount(trainers.length);
        setProgrammeCount(programmes.length);
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
      <h2 className="mb-4">Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center"><Card.Body><Card.Title>Members</Card.Title><Card.Text className="fs-3">{memberCount}</Card.Text></Card.Body></Card>
            </Col>
            <Col md={4}>
              <Card className="text-center"><Card.Body><Card.Title>Trainers</Card.Title><Card.Text className="fs-3">{trainerCount}</Card.Text></Card.Body></Card>
            </Col>
            <Col md={4}>
              <Card className="text-center"><Card.Body><Card.Title>Programmes</Card.Title><Card.Text className="fs-3">{programmeCount}</Card.Text></Card.Body></Card>
            </Col>
          </Row>
          <Row>
            <Col md={3}><Card><Card.Body><Card.Title>Members</Card.Title><Link to="/admin/members" className="btn btn-primary">Go</Link></Card.Body></Card></Col>
            <Col md={3}><Card><Card.Body><Card.Title>Trainers</Card.Title><Link to="/admin/trainers" className="btn btn-primary">Go</Link></Card.Body></Card></Col>
            <Col md={3}><Card><Card.Body><Card.Title>Programmes</Card.Title><Link to="/admin/programmes" className="btn btn-primary">Go</Link></Card.Body></Card></Col>
            <Col md={3}><Card><Card.Body><Card.Title>All Users</Card.Title><Link to="/admin/users" className="btn btn-primary">Go</Link></Card.Body></Card></Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;