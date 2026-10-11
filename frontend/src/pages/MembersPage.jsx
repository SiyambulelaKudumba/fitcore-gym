import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import memberService from '../services/memberService';
import trainerService from '../services/trainerService';
import programmeService from '../services/programmeService';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'PreferNotToSay'];
const MEMBERSHIP_OPTIONS = ['Monthly', 'Quarterly', 'Annual'];
const SEARCH_BY_OPTIONS = [
  { value: 'memberNumber', label: 'Member Number' },
  { value: 'name', label: 'Name' },
  { value: 'surname', label: 'Surname' },
];

const EMPTY_FORM = {
  memberNumber: '', firstName: '', lastName: '', gender: 'Male', dateOfBirth: '',
  homeAddress: '', email: '', phoneNumber: '', membershipType: 'Monthly',
  trainerId: '', trainingProgrammeId: '',
};

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAssignTrainer, setShowAssignTrainer] = useState(false);
  const [assignTrainerMember, setAssignTrainerMember] = useState(null);
  const [assignTrainerId, setAssignTrainerId] = useState('');
  const [assigningTrainer, setAssigningTrainer] = useState(false);
  const [showAssignProg, setShowAssignProg] = useState(false);
  const [assignProgMember, setAssignProgMember] = useState(null);
  const [assignProgId, setAssignProgId] = useState('');
  const [assigningProg, setAssigningProg] = useState(false);

  const loadMembers = async () => {
    setLoading(true); setError('');
    try { setMembers(await memberService.getAll(search, searchBy)); }
    catch (err) { setError(err.response?.data?.message || 'Could not load members.'); }
    finally { setLoading(false); }
  };

  const loadDropdowns = async () => {
    try {
      const [t, p] = await Promise.all([trainerService.getAll(), programmeService.getAll()]);
      setTrainers(t); setProgrammes(p);
    } catch {}
  };

  useEffect(() => { loadMembers(); }, [search, searchBy]);
  useEffect(() => { loadDropdowns(); }, []);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setFormError(''); setShowForm(true); };
  const openEdit = (member) => {
    setEditingId(member.id);
    setForm({
      memberNumber: member.memberNumber || '', firstName: member.firstName, lastName: member.lastName,
      gender: member.gender, dateOfBirth: member.dateOfBirth ? member.dateOfBirth.slice(0, 10) : '',
      homeAddress: member.homeAddress || '', email: member.email, phoneNumber: member.phoneNumber || '',
      membershipType: member.membershipType, trainerId: member.trainerId || '', trainingProgrammeId: member.trainingProgrammeId || '',
    });
    setFormError(''); setShowForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault(); setFormError('');
    if (!form.firstName.trim()) return setFormError('First name is required.');
    if (!form.lastName.trim()) return setFormError('Last name is required.');
    if (!form.dateOfBirth) return setFormError('Date of birth is required.');
    if (!form.homeAddress.trim()) return setFormError('Home address is required.');
    if (!form.email.trim()) return setFormError('Email is required.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return setFormError('Email is not valid.');
    if (form.phoneNumber && form.phoneNumber.length > 15) return setFormError('Phone number must be 15 characters or fewer.');
    setSaving(true);
    try {
      const payload = {
        memberNumber: form.memberNumber.trim() || null, firstName: form.firstName.trim(), lastName: form.lastName.trim(),
        gender: form.gender, dateOfBirth: form.dateOfBirth, homeAddress: form.homeAddress.trim(),
        email: form.email.trim(), phoneNumber: form.phoneNumber.trim() || null, membershipType: form.membershipType,
        trainerId: form.trainerId ? Number(form.trainerId) : null,
        trainingProgrammeId: form.trainingProgrammeId ? Number(form.trainingProgrammeId) : null,
      };
      if (editingId) await memberService.update(editingId, payload);
      else await memberService.create(payload);
      setShowForm(false); await loadMembers();
    } catch (err) { setFormError(err.response?.data?.message || 'Could not save member.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try { await memberService.delete(id); await loadMembers(); }
    catch (err) { setError(err.response?.data?.message || 'Could not delete member.'); }
  };

  const openAssignTrainer = (member) => { setAssignTrainerMember(member); setAssignTrainerId(member.trainerId || ''); setShowAssignTrainer(true); };
  const handleAssignTrainer = async (e) => {
    e.preventDefault(); if (!assignTrainerId) return; setAssigningTrainer(true);
    try { await memberService.assignTrainer(assignTrainerMember.id, Number(assignTrainerId)); setShowAssignTrainer(false); await loadMembers(); }
    catch (err) { setError(err.response?.data?.message || 'Could not assign trainer.'); }
    finally { setAssigningTrainer(false); }
  };

  const openAssignProg = (member) => { setAssignProgMember(member); setAssignProgId(member.trainingProgrammeId || ''); setShowAssignProg(true); };
  const handleAssignProg = async (e) => {
    e.preventDefault(); if (!assignProgId) return; setAssigningProg(true);
    try { await memberService.assignProgramme(assignProgMember.id, Number(assignProgId)); setShowAssignProg(false); await loadMembers(); }
    catch (err) { setError(err.response?.data?.message || 'Could not assign programme.'); }
    finally { setAssigningProg(false); }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Members</h2>
        <Button variant="primary" onClick={openCreate}>+ New Member</Button>
      </div>
      <div className="d-flex gap-2 mb-3" style={{ maxWidth: 600 }}>
        <Form.Control placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Form.Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)} style={{ maxWidth: 200 }}>
          {SEARCH_BY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Form.Select>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : (
        <Table striped bordered hover responsive>
          <thead><tr><th>Member #</th><th>Name</th><th>Email</th><th>Membership</th><th>Trainer</th><th>Programme</th><th style={{ width: 320 }}>Actions</th></tr></thead>
          <tbody>
            {members.length === 0 ? <tr><td colSpan="7" className="text-center">No members found.</td></tr> : members.map((m) => (
              <tr key={m.id}>
                <td>{m.memberNumber}</td><td>{m.firstName} {m.lastName}</td><td>{m.email}</td><td>{m.membershipType}</td>
                <td>{m.trainerName || '—'}</td><td>{m.trainingProgrammeName || '—'}</td>
                <td>
                  <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => openEdit(m)}>Edit</Button>
                  <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openAssignTrainer(m)}>Trainer</Button>
                  <Button size="sm" variant="outline-success" className="me-1" onClick={() => openAssignProg(m)}>Programme</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(m.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton><Modal.Title>{editingId ? 'Edit Member' : 'New Member'}</Modal.Title></Modal.Header>
          <Modal.Body>
            {formError && <Alert variant="danger">{formError}</Alert>}
            <Form.Group className="mb-3"><Form.Label>Member Number</Form.Label><Form.Control name="memberNumber" value={form.memberNumber} onChange={handleChange} placeholder="Auto-generated if left blank" /></Form.Group>
            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill"><Form.Label>First Name *</Form.Label><Form.Control name="firstName" value={form.firstName} onChange={handleChange} required /></Form.Group>
              <Form.Group className="mb-3 flex-fill"><Form.Label>Last Name *</Form.Label><Form.Control name="lastName" value={form.lastName} onChange={handleChange} required /></Form.Group>
            </div>
            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill"><Form.Label>Gender *</Form.Label><Form.Select name="gender" value={form.gender} onChange={handleChange}>{GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}</Form.Select></Form.Group>
              <Form.Group className="mb-3 flex-fill"><Form.Label>Date of Birth *</Form.Label><Form.Control type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required /></Form.Group>
            </div>
            <Form.Group className="mb-3"><Form.Label>Home Address *</Form.Label><Form.Control name="homeAddress" value={form.homeAddress} onChange={handleChange} required /></Form.Group>
            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill"><Form.Label>Email *</Form.Label><Form.Control type="email" name="email" value={form.email} onChange={handleChange} required /></Form.Group>
              <Form.Group className="mb-3 flex-fill"><Form.Label>Phone Number</Form.Label><Form.Control name="phoneNumber" value={form.phoneNumber} onChange={handleChange} maxLength={15} placeholder="Optional" /></Form.Group>
            </div>
            <Form.Group className="mb-3"><Form.Label>Membership Type *</Form.Label><Form.Select name="membershipType" value={form.membershipType} onChange={handleChange}>{MEMBERSHIP_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</Form.Select></Form.Group>
            <div className="d-flex gap-3">
              <Form.Group className="mb-3 flex-fill"><Form.Label>Trainer</Form.Label><Form.Select name="trainerId" value={form.trainerId} onChange={handleChange}><option value="">-- None --</option>{trainers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}</Form.Select></Form.Group>
              <Form.Group className="mb-3 flex-fill"><Form.Label>Training Programme</Form.Label><Form.Select name="trainingProgrammeId" value={form.trainingProgrammeId} onChange={handleChange}><option value="">-- None --</option>{programmes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Form.Select></Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowForm(false)} disabled={saving}>Cancel</Button><Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</Button></Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showAssignTrainer} onHide={() => setShowAssignTrainer(false)}>
        <Form onSubmit={handleAssignTrainer}>
          <Modal.Header closeButton><Modal.Title>Assign Trainer to {assignTrainerMember?.firstName} {assignTrainerMember?.lastName}</Modal.Title></Modal.Header>
          <Modal.Body><Form.Group><Form.Label>Select Trainer</Form.Label><Form.Select value={assignTrainerId} onChange={(e) => setAssignTrainerId(e.target.value)} required><option value="">-- Choose trainer --</option>{trainers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.specialization})</option>)}</Form.Select></Form.Group></Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowAssignTrainer(false)} disabled={assigningTrainer}>Cancel</Button><Button type="submit" variant="primary" disabled={assigningTrainer || !assignTrainerId}>{assigningTrainer ? 'Assigning...' : 'Assign'}</Button></Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showAssignProg} onHide={() => setShowAssignProg(false)}>
        <Form onSubmit={handleAssignProg}>
          <Modal.Header closeButton><Modal.Title>Assign Programme to {assignProgMember?.firstName} {assignProgMember?.lastName}</Modal.Title></Modal.Header>
          <Modal.Body><Form.Group><Form.Label>Select Programme</Form.Label><Form.Select value={assignProgId} onChange={(e) => setAssignProgId(e.target.value)} required><option value="">-- Choose programme --</option>{programmes.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.duration})</option>)}</Form.Select></Form.Group></Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowAssignProg(false)} disabled={assigningProg}>Cancel</Button><Button type="submit" variant="primary" disabled={assigningProg || !assignProgId}>{assigningProg ? 'Assigning...' : 'Assign'}</Button></Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default MembersPage;