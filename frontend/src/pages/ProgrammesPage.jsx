import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import programmeService from '../services/programmeService';

const FITNESS_GOAL_OPTIONS = ['WeightLoss', 'MuscleBuilding', 'GeneralFitness', 'Strength', 'Endurance'];
const EMPTY_FORM = { name: '', description: '', duration: '', fitnessGoal: 'GeneralFitness' };

const ProgrammesPage = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProgrammes = async () => {
    setLoading(true); setError('');
    try { setProgrammes(await programmeService.getAll()); }
    catch (err) { setError(err.response?.data?.message || 'Could not load programmes.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProgrammes(); }, []);

  const openCreateModal = () => { setEditingId(null); setForm(EMPTY_FORM); setFormError(''); setShowModal(true); };
  const openEditModal = (programme) => {
    setEditingId(programme.id);
    setForm({ name: programme.name, description: programme.description || '', duration: programme.duration, fitnessGoal: programme.fitnessGoal });
    setFormError(''); setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault(); setFormError('');
    if (!form.name.trim()) return setFormError('Name is required.');
    if (!form.duration.trim()) return setFormError('Duration is required.');
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() || null, duration: form.duration.trim(), fitnessGoal: form.fitnessGoal };
      if (editingId) await programmeService.update(editingId, payload);
      else await programmeService.create(payload);
      setShowModal(false); await loadProgrammes();
    } catch (err) { setFormError(err.response?.data?.message || 'Could not save programme.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this programme?')) return;
    try { await programmeService.delete(id); await loadProgrammes(); }
    catch (err) { setError(err.response?.data?.message || 'Could not delete programme.'); }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Training Programmes</h2>
        <Button variant="primary" onClick={openCreateModal}>+ New Programme</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : (
        <Table striped bordered hover responsive>
          <thead><tr><th>Name</th><th>Description</th><th>Duration</th><th>Fitness Goal</th><th style={{ width: 180 }}>Actions</th></tr></thead>
          <tbody>
            {programmes.length === 0 ? <tr><td colSpan="5" className="text-center">No programmes yet.</td></tr> : programmes.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.description || '—'}</td><td>{p.duration}</td><td>{p.fitnessGoal}</td>
                <td>
                  <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => openEditModal(p)}>Edit</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton><Modal.Title>{editingId ? 'Edit Programme' : 'New Programme'}</Modal.Title></Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <Form.Group className="mb-3"><Form.Label>Name *</Form.Label><Form.Control name="name" value={form.name} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} name="description" value={form.description} onChange={handleChange} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Duration *</Form.Label><Form.Control name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 12 weeks" required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Fitness Goal *</Form.Label><Form.Select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange}>{FITNESS_GOAL_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}</Form.Select></Form.Group>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button><Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</Button></Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProgrammesPage;