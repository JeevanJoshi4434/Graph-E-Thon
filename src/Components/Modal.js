import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function MyVerticallyCenteredModal(props) {
    const {setShow} = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <h4>{props.Heading}</h4>
        <p>
          {props.Content}
        </p>
        {props.extra ? props.extra : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
        <Button onClick={props.onConfirm}>{props.ButtonText}</Button>
      </Modal.Footer>
    </Modal>
  );
}
