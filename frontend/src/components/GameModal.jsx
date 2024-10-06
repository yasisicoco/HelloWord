import Modal from 'react-modal';

Modal.setAppElement('#root'); // App 컴포넌트가 렌더링되는 루트를 지정

const GameModal = ({ isOpen, message, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={message}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          background: '#fff',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
        },
      }}>
      <h2>{message}</h2>
    </Modal>
  );
};

export default GameModal;
