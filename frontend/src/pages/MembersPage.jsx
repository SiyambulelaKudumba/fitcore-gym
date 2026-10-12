import { useEffect, useState } from "react";
import { Container, Button, Form as BSForm, Row, Col } from "react-bootstrap";
import Table from "../components/Table";
import Modal from "../components/Modal";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getMembers, createMember, updateMember, deleteMember,
} from "../services/memberService";
import { getTrainers } from "../services/trainerService";
import { getProgrammes } from "../services/programmeService";

const emptyForm = {
  memberNumber: "", firstName: "", lastName: "", gender: "Male",
  dateOfBirth: "", homeAddress: "", email: "", phoneNumber: "",
  membershipType: "Monthly", trainerId: "", trainingProgrammeId: "",
};

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [programmes, setProgrammes] = useState([]);
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
      const [m, t, p] = await Promise.all([
        getMembers(search, searchBy), getTrainers(), getProgrammes(),
      ]);
      setMembers(m);
      setTrainers(t);
      setProgrammes(p);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, searchBy]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      memberNumber: member.memberNumber || "",
      firstName: member.firstName, lastName: member.lastName,
      gender: member.gender, dateOfBirth: member.dateOfBirth?.split("T")[0] || "",
      homeAddress: member.homeAddress, email: member.email,
      phoneNumber: member.phoneNumber || "",
      membershipType: member.membershipType,
      trainerId: member.trainerId || "",
      trainingProgrammeId: member.trainingProgrammeId || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    const payload = {
      ...form,
      trainerId: form.trainerId ? Number(form.trainerId) : null,
      trainingProgrammeId: form.trainingProgrammeId ? Number(form.trainingProgrammeId) : null,
    };
    try {
      if (editing) await updateMember(editing.id, payload);
      else await createMember(payload);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await deleteMember(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const columns = [
    { key: "memberNumber", label: "Member #" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "membershipType", label: "Membership" },
    { key: "trainerName", label: "Trainer", render: (r) => r.trainerName || "—" },
  ];

  return (
    <Container className="page-container">
      <h2>Members</h2>
      <ErrorAlert message={error} onClose={() => setError("")} />
      <Row className="mb-3">
        <Col md={5}>
          <BSForm.Control
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <BSForm.Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
            <option value="memberNumber">Member Number</option>
            <option value="name">Name</option>
            <option value="surname">Surname</option>
          </BSForm.Select>
        </Col>
        <Col md={4} className="text-end">
          <Button onClick={openAdd}>Add Member</Button>
        </Col>
      </Row>

      {loading ? <LoadingSpinner /> : (
        <Table
          columns={columns}
          data={members}
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
        title={editing ? "Edit Member" : "Add Member"}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <Row>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Member Number (optional)</BSForm.Label>
              <BSForm.Control name="memberNumber" value={form.memberNumber} onChange={handleChange} />
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
              <BSForm.Label>Date of Birth</BSForm.Label>
              <BSForm.Control name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={12}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Home Address</BSForm.Label>
              <BSForm.Control name="homeAddress" value={form.homeAddress} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Phone (optional)</BSForm.Label>
              <BSForm.Control name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Membership Type</BSForm.Label>
              <BSForm.Select name="membershipType" value={form.membershipType} onChange={handleChange}>
                <option>Monthly</option><option>Quarterly</option><option>Annual</option>
              </BSForm.Select>
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Assign Trainer</BSForm.Label>
              <BSForm.Select name="trainerId" value={form.trainerId} onChange={handleChange}>
                <option value="">— None —</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                ))}
              </BSForm.Select>
            </BSForm.Group>
          </Col>
          <Col md={6}>
            <BSForm.Group className="mb-2">
              <BSForm.Label>Assign Programme</BSForm.Label>
              <BSForm.Select name="trainingProgrammeId" value={form.trainingProgrammeId} onChange={handleChange}>
                <option value="">— None —</option>
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </BSForm.Select>
            </BSForm.Group>
          </Col>
        </Row>
      </Modal>
    </Container>
  );
}