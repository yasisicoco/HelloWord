import Modal from 'react-modal';

import './Result.sass';

Modal.setAppElement('#root'); // App 컴포넌트가 렌더링되는 루트를 지정

const ResultModal = ({ isOpen, message, onRequestClose, isCorrect }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '0',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column', // 이미지와 텍스트를 수직으로 배치
        },
      }}>
      <div className="resultModal-page">
        <img
          src={isCorrect ? correct : wrong}
          alt={isCorrect ? '정답 이미지' : '오답 이미지'}
          className="resultModal-img"
        />
        <p className="resultModal-word">{message}</p>
      </div>
    </Modal>
  );
};

export default ResultModal;
