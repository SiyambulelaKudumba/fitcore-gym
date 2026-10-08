import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import trainerService from '../services/trainerService';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'PreferNotToSay'];
const SPECIALIZATION_OPTIONS = [
  'WeightTraining',
  'Cardio',
  'StrengthAndConditioning',
  'GeneralFitness',
  'WeightLoss',
];
const SEARCH_BY_OPTIONS = [
  { value: 'staffNumber', label: 'Staff Number' },
  { value: 'name', label: 'Name' },
  { value: 'surname', label: 'Surname' },
];

const EMPTY_FORM = {
  staffNumber: '',
  firstName: '',
  lastName: '',
  gender: 'Male',
  email: '',
  phoneNumber: '',
  specialization: 'GeneralFitness',
};

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search state
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadTrainers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await trainerService.getAll(search, searchBy);
      setTrainers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load trainers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchBy]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (trainer) => {
    setEditingId(trainer.id);
    setForm({
      staffNumber: trainer.staffNumber || '',
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      gender: trainer.gender,
      email: trainer.email,
      phoneNumber: trainer.phoneNumber || '',
      specialization: trainer.specialization,
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

    if (!form.firstName.trim()) return setFormError('First name is required.');
    if (!form.lastName.trim()) return setFormError('Last name is required.');
    if (!form.email.trim()) return setFormError('Email is required.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return setFormError('Email is not valid.');

    if (form.phoneNumber && form.phoneNumber.length > 15) {
      return setFormError('Phone number must be 15 characters or fewer.');
    }

    setSaving(true);
    try {
      const payload = {
        staffNumber: form.staffNumber.trim() || null,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
        specialization: form.specialization,
      };

      if (editingId) {
        await trainerService.update(editingId, payload);
      } else {
        await trainerService.create(payload);
      }

      setShowModal(false);
      await loadTrainers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save trainer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    try {
      await trainerService.delete(id);
      await loadTrainers();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete trainer.');
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Trainers</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + New Trainer
        </Button>
      </div>

      {/* Search bar */}
      <div className="d-flex gap-2 mb-3" style={{ maxWidth: 600 }}>
        <Form.Control
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Form.Select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          {SEARCH_BY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Form.Select>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Staff #</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No trainers found.</td>
              </tr>
            ) : (
              trainers.map((t) => (
                <tr key={t.id}>
                  <td>{t.staffNumber}</td>
                  <td>{t.firstName} {t.lastName}</td>
                  <td>{t.email}</td>
                  <td>{t.phoneNumber || '—'}</td>
                  <td>{t.specialization}</td>
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
            <Modal.Title>{editingId ? 'Edit Trainer' : 'New Trainer'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label>Staff Number</Form.Label>
              <Form.Control
                name="staffNumber"
                value={form.staffNumber}
                onChange={handleChange}
                placeholder="Auto-generated if left blank"
              />
            </Form.Group>

            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill">
                <Form.Label>First Name *</Form.Label>
                <Form.Control
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3 flex-fill">
                <Form.Label>Last Name *</Form.Label>
                <Form.Control
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Gender *</Form.Label>
              <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                maxLength={15}
                placeholder="Optional"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialization *</Form.Label>
              <Form.Select
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
              >
                {SPECIALIZATION_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
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

export default TrainersPage;