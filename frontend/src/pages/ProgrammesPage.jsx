import { useEffect, useState } from "react";
import { Container, Button, Form as BSForm, Row, Col } from "react-bootstrap";
import Table from "../components/Table";
import Modal from "../components/Modal";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getProgrammes, createProgramme, updateProgramme, deleteProgramme,
} from "../services/programmeService";

const emptyForm = { name: "", description: "", duration: "", fitnessGoal: "GeneralFitness" };
const goals = ["WeightLoss", "MuscleBuilding", "GeneralFitness", "Strength", "Endurance"];

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try { setProgrammes(await getProgrammes()); }
    catch (err) { setError(err.response?.data?.message || "Failed to load programmes."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", duration: p.duration, fitnessGoal: p.fitnessGoal });
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    try {
      if (editing) await updateProgramme(editing.id, form);
      else await createProgramme(form);
      setShowModal(false);
      load();
    } catch (err) { setError(err.response?.data?.message || "Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this programme?")) return;
    try { await deleteProgramme(id); load(); }
    catch (err) { setError(err.response?.data?.message || "Delete failed."); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "duration", label: "Duration" },
    { key: "fitnessGoal", label: "Goal" },
  ];

  return (
    <Container className="page-container">
      <h2>Training Programmes</h2>
      <ErrorAlert message={error} onClose={() => setError("")} />
      <div className="text-end mb-3">
        <Button onClick={openAdd}>Add Programme</Button>
      </div>
      {loading ? <LoadingSpinner /> : (
        <Table
          columns={columns}
          data={programmes}
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
        title={editing ? "Edit Programme" : "Add Programme"}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <BSForm.Group className="mb-2">
          <BSForm.Label>Name</BSForm.Label>
          <BSForm.Control name="name" value={form.name} onChange={handleChange} />
        </BSForm.Group>
        <BSForm.Group className="mb-2">
          <BSForm.Label>Description</BSForm.Label>
          <BSForm.Control as="textarea" name="description" value={form.description} onChange={handleChange} />
        </BSForm.Group>
        <BSForm.Group className="mb-2">
          <BSForm.Label>Duration (e.g. "12 weeks")</BSForm.Label>
          <BSForm.Control name="duration" value={form.duration} onChange={handleChange} />
        </BSForm.Group>
        <BSForm.Group className="mb-2">
          <BSForm.Label>Fitness Goal</BSForm.Label>
          <BSForm.Select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange}>
            {goals.map((g) => <option key={g}>{g}</option>)}
          </BSForm.Select>
        </BSForm.Group>
      </Modal>
    </Container>
  );
}