import { useEffect, useState } from 'react';
import {
  Container, Table, Button, Modal, Form, Spinner, Alert, Badge,
} from 'react-bootstrap';
import workoutTaskService from '../services/workoutTaskService';
import workoutPlanService from '../services/workoutPlanService';

const STATUS_OPTIONS = ['NotStarted', 'InProgress', 'Complete'];
const STATUS_BADGE = { NotStarted: 'secondary', InProgress: 'warning', Complete: 'success' };

const EMPTY_FORM = {
  exerciseName: '',
  description: '',
  numberOfSets: 3,
  numberOfRepetitions: 10,
  dueDate: '',
  workoutPlanId: '',
  status: 'NotStarted',
};

const TrainerTasksPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Load trainer's plans once
  useEffect(() => {
    const load = async () => {
      try {
        const data = await workoutPlanService.getMyPlans();
        setPlans(data);
        if (data.length > 0) {
          setSelectedPlanId(String(data[0].id));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load plans.');
      }
    };
    load();
  }, []);

  // Load tasks whenever plan changes
  const loadTasks = async () => {
    if (!selectedPlanId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await workoutTaskService.getByPlan(selectedPlanId);
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
  }, [selectedPlanId]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, workoutPlanId: selectedPlanId });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingId(task.id);
    setForm({
      exerciseName: task.exerciseName,
      description: task.description || '',
      numberOfSets: task.numberOfSets,
      numberOfRepetitions: task.numberOfRepetitions,
      dueDate: task.dueDate.slice(0, 10), // YYYY-MM-DD for input type="date"
      workoutPlanId: task.workoutPlanId,
      status: task.status,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.exerciseName.trim()) return setFormError('Exercise name is required.');
    if (!form.workoutPlanId) return setFormError('Please select a workout plan.');
    if (!form.dueDate) return setFormError('Due date is required.');

    const sets = Number(form.numberOfSets);
    const reps = Number(form.numberOfRepetitions);
    if (sets < 1 || sets > 20) return setFormError('Sets must be between 1 and 20.');
    if (reps < 1 || reps > 100) return setFormError('Reps must be between 1 and 100.');

    setSaving(true);
    try {
      if (editingId) {
        await workoutTaskService.update(editingId, {
          exerciseName: form.exerciseName.trim(),
          description: form.description.trim() || null,
          numberOfSets: sets,
          numberOfRepetitions: reps,
          dueDate: form.dueDate,
          status: form.status,
        });
      } else {
        await workoutTaskService.create({
          exerciseName: form.exerciseName.trim(),
          description: form.description.trim() || null,
          numberOfSets: sets,
          numberOfRepetitions: reps,
          dueDate: form.dueDate,
          workoutPlanId: Number(form.workoutPlanId),
        });
      }
      setShowModal(false);
      await loadTasks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save task.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await workoutTaskService.delete(id);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete task.');
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Workout Tasks</h2>
        <Button
          variant="primary"
          onClick={openCreateModal}
          disabled={!selectedPlanId}
        >
          + New Task
        </Button>
      </div>

      <Form.Group className="mb-3" style={{ maxWidth: 400 }}>
        <Form.Label>Select a workout plan</Form.Label>
        <Form.Select
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
        >
          <option value="">-- Choose plan --</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No tasks in this plan yet.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.exerciseName}</td>
                  <td>{t.numberOfSets}</td>
                  <td>{t.numberOfRepetitions}</td>
                  <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td><Badge bg={STATUS_BADGE[t.status]}>{t.status}</Badge></td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => openEditModal(t)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Edit Task' : 'New Task'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Exercise Name *</Form.Label>
              <Form.Control
                name="exerciseName"
                value={form.exerciseName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Workout Plan *</Form.Label>
              <Form.Select
                name="workoutPlanId"
                value={form.workoutPlanId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select plan --</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill">
                <Form.Label>Sets (1–20) *</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={20}
                  name="numberOfSets"
                  value={form.numberOfSets}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 flex-fill">
                <Form.Label>Reps (1–100) *</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={100}
                  name="numberOfRepetitions"
                  value={form.numberOfRepetitions}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Due Date *</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {editingId && (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TrainerTasksPage;