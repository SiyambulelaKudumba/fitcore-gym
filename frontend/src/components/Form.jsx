import { Form as BSForm, Button } from "react-bootstrap";

export default function Form({ onSubmit, error, children, submitLabel = "Save" }) {
  return (
    <BSForm onSubmit={onSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      {children}
      <Button type="submit" variant="primary" className="mt-3">
        {submitLabel}
      </Button>
    </BSForm>
  );
}