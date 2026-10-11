import { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import workoutTaskService from '../services/workoutTaskService';

const STATUS_BADGE = {
  NotStarted: 'secondary',
  InProgress: 'warning',
  Complete: 'success',
};

const WorkoutTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await workoutTaskService.getAll();
        setTasks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load workout tasks.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">All Workout Tasks</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Plan</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No workout tasks.</td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.exerciseName}</td>
                  <td>{t.workoutPlanName}</td>
                  <td>{t.numberOfSets}</td>
                  <td>{t.numberOfRepetitions}</td>
                  <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td><Badge bg={STATUS_BADGE[t.status]}>{t.status}</Badge></td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default WorkoutTasksPage;