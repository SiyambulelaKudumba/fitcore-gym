import { useEffect, useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import Table from "../components/Table";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import { getMembers } from "../services/memberService";
import { getTrainers } from "../services/trainerService";

export default function UsersByTypePage() {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMembers(), getTrainers()])
      .then(([m, t]) => { setMembers(m); setTrainers(t); })
      .catch((err) => setError(err.response?.data?.message || "Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const memberCols = [
    { key: "memberNumber", label: "Member #" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "membershipType", label: "Membership" },
  ];

  const trainerCols = [
    { key: "staffNumber", label: "Staff #" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
  ];

  return (
    <Container className="page-container">
      <h2>Users by Type</h2>
      <ErrorAlert message={error} onClose={() => setError("")} />
      {loading ? <LoadingSpinner /> : (
        <Tabs defaultActiveKey="members" className="mb-3">
          <Tab eventKey="members" title={`Members (${members.length})`}>
            <Table columns={memberCols} data={members} />
          </Tab>
          <Tab eventKey="trainers" title={`Trainers (${trainers.length})`}>
            <Table columns={trainerCols} data={trainers} />
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}