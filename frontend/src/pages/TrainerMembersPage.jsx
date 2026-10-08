import { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import trainerService from '../services/trainerService';

const TrainerMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // For the "View Programmes" modal
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [programmes, setProgrammes] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await trainerService.getMyMembers();
        setMembers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load members.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleViewProgrammes = async (member) => {
    setSelectedMember(member);
    setShowModal(true);
    setModalLoading(true);
    try {
      const data = await trainerService.getMemberProgrammes(member.id);
      setProgrammes(data);
    } catch (err) {
      setProgrammes([]);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">My Assigned Members</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Member #</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership</th>
              <th>Programme</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No members assigned to you yet.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id}>
                  <td>{m.memberNumber}</td>
                  <td>{m.firstName} {m.lastName}</td>
                  <td>{m.email}</td>
                  <td>{m.phoneNumber || '—'}</td>
                  <td>{m.membershipType}</td>
                  <td>{m.trainingProgrammeName || '—'}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleViewProgrammes(m)}
                    >
                      View Programmes
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Modal for member programmes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Programmes for {selectedMember?.firstName} {selectedMember?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : programmes.length === 0 ? (
            <p className="text-muted mb-0">No programmes assigned.</p>
          ) : (
            <ul className="mb-0">
              {programmes.map((p) => (
                <li key={p.id}>
                  <strong>{p.name}</strong> — {p.duration} ({p.fitnessGoal})
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TrainerMembersPage;