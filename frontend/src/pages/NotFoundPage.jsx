import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container className="text-center mt-5">
      <h1>404</h1>
      <p>Page not found.</p>
      <Button as={Link} to="/" variant="primary">Go Home</Button>
    </Container>
  );
}