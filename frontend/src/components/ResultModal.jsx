import Modal from 'react-modal';
import './Result.sass';
import medalImage from '../assets/game/coin.png'; // 업로드한 메달 이미지 사용

Modal.setAppElement('#root'); // App 컴포넌트가 렌더링되는 루트를 지정

const ResultModal = ({ isOpen, correctAnswer, totalRounds, onRetry, onQuit }) => {
  // 맞춘 비율에 따라 메달 개수 설정 (0~3개)
  let medalCount = 0;
  if (correctAnswer === totalRounds) {
    medalCount = 3;
  } else if (correctAnswer >= 3) {
    medalCount = 2;
  } else if (correctAnswer >= 1) {
    medalCount = 1;
  } else {
    medalCount = 0;
  }

  // 메달 이미지들을 배열로 생성, 맞춘 메달은 정상적으로, 나머지는 회색으로 표시
  const medals = Array(3)
    .fill(0)
    .map((_, index) => (
      <img
        key={index}
        src={medalImage}
        alt={`메달 ${index + 1}`}
        className={`resultModal-medal ${index < medalCount ? '' : 'gray-medal'}`} // 맞춘 개수에 따라 회색 적용
      />
    ));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onQuit}
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
          background: 'rgba(255, 255, 255, 0.9)', // 약간의 투명 배경
          borderRadius: '20px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          width: '80%',
          maxWidth: '400px',
          textAlign: 'center',
        },
      }}>
      <div className="resultModal-page">
        <h2 className="resultModal-page__title">결과</h2>
        <div className="resultModal-page__medals">{medals}</div>
        <div className="resultModal-page__buttons">
          <button className="resultModal-page__buttons--button retry-button" onClick={onRetry}>
            다시하기
          </button>
          <button className="resultModal-page__buttons--button quit-button" onClick={onQuit}>
            그만하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ResultModal;
