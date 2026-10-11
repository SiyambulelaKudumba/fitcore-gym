import { Modal as BSModal, Button } from "react-bootstrap";

export default function Modal({ show, title, onClose, onSave, children }) {
  return (
    <BSModal show={show} onHide={onClose}>
      <BSModal.Header closeButton>
        <BSModal.Title>{title}</BSModal.Title>
      </BSModal.Header>
      <BSModal.Body>{children}</BSModal.Body>
      <BSModal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </BSModal.Footer>
    </BSModal>
  );
}