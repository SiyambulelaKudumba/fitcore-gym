import { useEffect, useState } from "react";
import { Container, Button, Form as BSForm, Row, Col } from "react-bootstrap";
import Table from "../components/Table";
import Modal from "../components/Modal";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from "../services/trainerService";

const emptyForm = {
  staffNumber: "", firstName: "", lastName: "", gender: "Male",
  email: "", phoneNumber: "", specialization: "GeneralFitness",
};

const specializations = [
  "WeightTraining", "Cardio", "StrengthAndConditioning", "GeneralFitness", "WeightLoss",
];

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTrainers(search, searchBy);
      setTrainers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, searchBy]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ ...t, phoneNumber: t.phoneNumber || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      if (editing) await updateTrainer(editing.id, form);
      else await createTrainer(form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trainer?")) return;
    try { await deleteTrainer(id); load(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed."); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const columns = [
    { key: "staffNumber", label: "Staff #" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
  ];

  return (
    <Container className="page-container">
      <h2>Trainers</h2>
      <ErrorAlert message={error} onClose={() => setError("")} />
      <Row className="mb-3">
        <Col md={5}>
          <BSForm.Control placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Col>
        <Col md={3}>
          <BSForm.Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
            <option value="staffNumber">Staff Number</option>
            <option value="name">Name</option>
            <option value="surname">Surname</option>
          </BSForm.Select>
        </Col>
        <Col md={4} className="text-end">
          <Button onClick={openAdd}>Add Trainer</Button>
        </Col>
      </Row>

      {loading ? <LoadingSpinner /> : (
        <Table
          columns={columns}
          data={trainers}
          actions={(row) => (
            <>
              <Button size="sm" variant="warning" className="me-2" onClick={() => openEdit(row)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
            </>
          )}
        />
      )}

      <Modal
        show={showModal}
        title={editing ? "Edit Trainer" : "Add Trainer"}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <Row>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Staff Number (optional)</BSForm.Label>
              <BSForm.Control name="staffNumber" value={form.staffNumber} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Email</BSForm.Label>
              <BSForm.Control name="email" type="email" value={form.email} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>First Name</BSForm.Label>
              <BSForm.Control name="firstName" value={form.firstName} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Last Name</BSForm.Label>
              <BSForm.Control name="lastName" value={form.lastName} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Gender</BSForm.Label>
              <BSForm.Select name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option><option>Female</option>
                <option>Other</option><option>PreferNotToSay</option>
              </BSForm.Select>
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Phone (optional)</BSForm.Label>
              <BSForm.Control name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={12}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Specialization</BSForm.Label>
              <BSForm.Select name="specialization" value={form.specialization} onChange={handleChange}>
                {specializations.map((s) => <option key={s}>{s}</option>)}
              </BSForm.Select>
            </BSForm.Group>
          </Col>
        </Row>
      </Modal>
    </Container>
  );
}