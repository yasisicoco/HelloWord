import Modal from 'react-modal';
import correct from '../assets/game/correct.png';
import wrong from '../assets/game/wrong.png';

import './GameModal.sass';

Modal.setAppElement('#root'); // App 컴포넌트가 렌더링되는 루트를 지정

const GameModal = ({ isOpen, message, onRequestClose, isCorrect }) => {
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
      <div className="gameModal-page">
        <img
          src={isCorrect ? correct : wrong}
          alt={isCorrect ? '정답 이미지' : '오답 이미지'}
          className="gameModal-img"
        />
        <p className="gameModal-word">{message}</p>
      </div>
    </Modal>
  );
};

export default GameModal;
