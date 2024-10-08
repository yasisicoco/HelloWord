import { useNavigate } from 'react-router-dom';
import './GameResult.sass';

const GameResult = ({ isOpen, onClose, correctCount, totalQuestions }) => {
  const nav = useNavigate();
  if (!isOpen) return null;

  const getStars = (correct) => {
    if (correct <= 1) return '☆';
    if (correct <= 3) return '★';
    if (correct === 4) return '★★';
    return '★★★';
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'game-result-overlay') {
      onClose();
      nav(-1);
    }
  };

  return (
    <div className="game-result-overlay" onClick={handleOverlayClick}>
      <div className="game-result-content">
        <h2>게임 결과</h2>
        <p>
          맞은 개수: {correctCount} / {totalQuestions}
        </p>
        <p>별점: {getStars(correctCount)}</p>
        <button
          onClick={() => {
            onClose();
            nav(-1); // 닫기 버튼 클릭 시 뒤로 가기
          }}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default GameResult;
