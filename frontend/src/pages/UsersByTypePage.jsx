import { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Table, Spinner, Alert } from 'react-bootstrap';
import memberService from '../services/memberService';
import trainerService from '../services/trainerService';

const UsersByTypePage = () => {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const [membersData, trainersData] = await Promise.all([memberService.getAll(), trainerService.getAll()]);
        setMembers(membersData); setTrainers(trainersData);
      } catch (err) { setError(err.response?.data?.message || 'Could not load users.'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Users by Type</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : (
        <Tabs defaultActiveKey="members" className="mb-3">
          <Tab eventKey="members" title={`Gym Members (${members.length})`}>
            <Table striped bordered hover responsive>
              <thead><tr><th>Member #</th><th>Name</th><th>Email</th><th>Phone</th><th>Membership</th></tr></thead>
              <tbody>
                {members.length === 0 ? <tr><td colSpan="5" className="text-center">No members.</td></tr> : members.map((m) => (
                  <tr key={m.id}><td>{m.memberNumber}</td><td>{m.firstName} {m.lastName}</td><td>{m.email}</td><td>{m.phoneNumber || '—'}</td><td>{m.membershipType}</td></tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="trainers" title={`Personal Trainers (${trainers.length})`}>
            <Table striped bordered hover responsive>
              <thead><tr><th>Staff #</th><th>Name</th><th>Email</th><th>Phone</th><th>Specialization</th></tr></thead>
              <tbody>
                {trainers.length === 0 ? <tr><td colSpan="5" className="text-center">No trainers.</td></tr> : trainers.map((t) => (
                  <tr key={t.id}><td>{t.staffNumber}</td><td>{t.firstName} {t.lastName}</td><td>{t.email}</td><td>{t.phoneNumber || '—'}</td><td>{t.specialization}</td></tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default UsersByTypePage;