import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import workoutPlanService from '../services/workoutPlanService';
import trainerService from '../services/trainerService';
import programmeService from '../services/programmeService';

// Empty form for creating new plans
const EMPTY_FORM = {
  name: '',
  description: '',
  memberId: '',
  trainingProgrammeId: '',
};

const TrainerPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = create, number = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [plansData, membersData, programmesData] = await Promise.all([
        workoutPlanService.getMyPlans(),
        trainerService.getMyMembers(),
        programmeService.getAll(),
      ]);
      setPlans(plansData);
      setMembers(membersData);
      setProgrammes(programmesData);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      description: plan.description || '',
      memberId: plan.memberId,
      trainingProgrammeId: plan.trainingProgrammeId,
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

    // Basic client-side validation
    if (!form.name.trim()) return setFormError('Name is required.');
    if (!form.memberId) return setFormError('Please select a member.');
    if (!form.trainingProgrammeId) return setFormError('Please select a programme.');

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        memberId: Number(form.memberId),
        trainingProgrammeId: Number(form.trainingProgrammeId),
        // trainerId left out — backend fills it from JWT for Trainer role
      };

      if (editingId) {
        await workoutPlanService.update(editingId, payload);
      } else {
        await workoutPlanService.create(payload);
      }

      setShowModal(false);
      await loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout plan?')) return;
    try {
      await workoutPlanService.delete(id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete plan.');
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Workout Plans</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + New Plan
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Member</th>
              <th>Programme</th>
              <th>Created</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No plans yet. Click "New Plan" to create one.
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.name}</td>
                  <td>{plan.memberName}</td>
                  <td>{plan.trainingProgrammeName}</td>
                  <td>{new Date(plan.createdDate).toLocaleDateString()}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => openEditModal(plan)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(plan.id)}
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

      {/* Create / Edit modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Edit Plan' : 'New Workout Plan'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Plan Name *</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Cardio Starter"
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
                placeholder="Optional description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Member *</Form.Label>
              <Form.Select
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.memberNumber})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Training Programme *</Form.Label>
              <Form.Select
                name="trainingProgrammeId"
                value={form.trainingProgrammeId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a programme --</option>
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.duration})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
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

export default TrainerPlansPage;