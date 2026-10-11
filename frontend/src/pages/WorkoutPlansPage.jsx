import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import workoutPlanService from '../services/workoutPlanService';

const WorkoutPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await workoutPlanService.getAll();
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
      <h2 className="mb-3">All Workout Plans</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Member</th>
              <th>Trainer</th>
              <th>Programme</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No workout plans.</td>
              </tr>
            ) : (
              plans.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.memberName}</td>
                  <td>{p.trainerName}</td>
                  <td>{p.trainingProgrammeName}</td>
                  <td>{new Date(p.createdDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default WorkoutPlansPage;