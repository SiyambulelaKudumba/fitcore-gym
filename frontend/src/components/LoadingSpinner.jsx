import { Spinner, Container } from "react-bootstrap";

export default function LoadingSpinner() {
  return (
    <Container className="text-center my-5">
      <Spinner animation="border" role="status" variant="primary" />
      <p className="mt-3">Loading...</p>
    </Container>
  );
}