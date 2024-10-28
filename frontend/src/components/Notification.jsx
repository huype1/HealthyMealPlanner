import Toast from "react-bootstrap/Toast";
import { useNotificationStore } from "../stores";
import { ToastContainer } from "react-bootstrap";
// Only use this 3 variants for simplicity
// 'Secondary',
// 'Success',
// 'Danger',
const Notification = () => {
  const { show, header, message, variant, hideNotification } =
    useNotificationStore();
  return (
    <ToastContainer className='p-3' position='bottom-start' style={{ zIndex: 2, position: "fixed" }}>
      <Toast
        position=''
        className='m-1'
        bg={variant}
        onClose={hideNotification}
        show={show}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className='me-auto'>{header}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Notification;
