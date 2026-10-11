import { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import memberService from '../services/memberService';

const MemberProgrammePage = () => {
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await memberService.getMyProgramme();
        setProgramme(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your programme.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">My Training Programme</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : programme ? (
        <Card style={{ maxWidth: 600 }}>
          <Card.Body>
            <Card.Title>{programme.name}</Card.Title>
            <Card.Text>{programme.description}</Card.Text>
            <p className="mb-1"><strong>Duration:</strong> {programme.duration}</p>
            <p className="mb-0"><strong>Fitness Goal:</strong> {programme.fitnessGoal}</p>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info">No programme assigned yet.</Alert>
      )}
    </Container>
  );
};

export default MemberProgrammePage;