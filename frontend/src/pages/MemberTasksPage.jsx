import { useEffect, useState } from 'react';
import { Container, Table, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import memberService from '../services/memberService';
import workoutTaskService from '../services/workoutTaskService';

const STATUS_OPTIONS = ['NotStarted', 'InProgress', 'Complete'];

const STATUS_BADGE = {
  NotStarted: 'secondary',
  InProgress: 'warning',
  Complete: 'success',
};

const MemberTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await memberService.getMyTasks(statusFilter);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (taskId, newStatus) => {
    setError('');
    try {
      const updated = await workoutTaskService.updateStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: updated.status } : t))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">My Workout Tasks</h2>

      <Form.Group className="mb-3" style={{ maxWidth: 300 }}>
        <Form.Label>Filter by status</Form.Label>
        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Description</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.exerciseName}</td>
                  <td>{task.description || '—'}</td>
                  <td>{task.numberOfSets}</td>
                  <td>{task.numberOfRepetitions}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={STATUS_BADGE[task.status]}>{task.status}</Badge>
                  </td>
                  <td style={{ minWidth: 160 }}>
                    <Form.Select
                      size="sm"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MemberTasksPage;