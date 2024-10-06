const GameResult = ({ isOpen, onClose, correctCount, totalQuestions }) => {
  if (!isOpen) return null;

  const getStars = (correct) => {
    if (correct <= 1) return '☆';
    if (correct <= 3) return '★';
    if (correct === 4) return '★★';
    return '★★★';
  };

  return (
    <div className="game-result-overlay">
      <div className="game-result-content">
        <h2>게임 결과</h2>
        <p>
          맞은 개수: {correctCount} / {totalQuestions}
        </p>
        <p>별점: {getStars(correctCount)}</p>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default GameResult;
