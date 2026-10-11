import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import memberService from '../services/memberService';

const MemberPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await memberService.getMyPlans();
        setPlans(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load workout plans.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">My Workout Plans</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Description</th>
              <th>Trainer</th>
              <th>Programme</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No workout plans yet.</td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.name}</td>
                  <td>{plan.description || '—'}</td>
                  <td>{plan.trainerName}</td>
                  <td>{plan.trainingProgrammeName}</td>
                  <td>{new Date(plan.createdDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MemberPlansPage;