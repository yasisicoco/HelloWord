import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaQuestionCircle } from 'react-icons/fa';

// API import
import { fetchGame3, fetchGameResult } from '../../api/GameAPI';
import PortraitModeWarning from '../../features/Games/portraitModeWarning';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import useTimer from '../../hooks/useTimer';
import ResultModal from '../../components/ResultModal';
import GameGuide from '../../components/Game3Guide';

// style
import './Game3Page.sass';

const Game3Page = () => {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [round, setRound] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true); // 가이드 모달
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [roundFinished, setRoundFinished] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState(0); // 틀린 횟수 추가

  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const onTimeUp = () => {
    showModal('시간이 초과되었습니다.😞');
    handleNextRound(false);
  };

  const showModal = (message, isCorrect) => {
    setIsModalOpen(true);
    setModalMessage(message);
    pauseTimer();
    setTimeout(() => {
      setIsModalOpen(false);
      resumeTimer();
    }, 1000);
    setIsCorrect(isCorrect);
  };

  const { timeLeft, resetTimer, pauseTimer, resumeTimer } = useTimer(20, onTimeUp);

  const updateRoundData = (currentRoundData) => {
    const wordCards = currentRoundData.words.map((word) => ({
      type: 'word',
      id: word.wordId,
      content: word.word,
      isMatched: false,
    }));
    const imageCards = currentRoundData.words.map((word) => ({
      type: 'image',
      id: word.wordId,
      content: word.imageUrl,
      isMatched: false,
    }));
    const allCards = [...wordCards, ...imageCards];
    const shuffledBlocks = shuffleArray(allCards);
    setBlocks(shuffledBlocks);
    resetTimer();
    setRoundStartTime(Date.now());
  };

  useEffect(() => {
    const fetchGameData = async () => {
      if (!accessToken) return;
      setIsDataLoading(true);
      try {
        const data = await fetchGame3(accessToken, kidId);
        setData(data.rounds);
        setTotalRounds(data.rounds.length);
        setIsGuideOpen(data.needsTutorial);
        if (data.rounds && data.rounds.length > 0) {
          updateRoundData(data.rounds[0]);
        }
      } catch (err) {
        showModal('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchGameData();
  }, [accessToken, kidId]);

  // 가이드 모달이 열릴 때 타이머 일시정지, 닫힐 때 타이머 재개
  useEffect(() => {
    if (isGuideOpen) {
      pauseTimer(); // 모달이 열리면 타이머 멈춤
    } else {
      resumeTimer(); // 모달이 닫히면 타이머 재개
    }
  }, [isGuideOpen]); // isGuideOpen 상태 변경 시마다 실행

  useEffect(() => {
    if (data && data[round]) {
      updateRoundData(data[round]);
    }
  }, [round, data]);

  const handleNextRound = (isAllCorrect) => {
    const roundEndTime = Date.now();
    const timeTaken = (roundEndTime - roundStartTime) / 1000;
    setTotalPlayTime((prevTime) => prevTime + timeTaken);

    setRoundFinished(true);
  };

  useEffect(() => {
    if (roundFinished) {
      if (round === totalRounds - 1) {
        setTimeout(() => {
          setIsResultModalOpen(true);
          pauseTimer();
        }, 1000);
      } else {
        setRound((prevRound) => prevRound + 1);
      }
      setRoundFinished(false);
      setSelectedCards([]);
    }
  }, [roundFinished, round, totalRounds]);

  const handleCardClick = (block) => {
    // 이미 선택된 카드이거나, 선택된 카드가 2개 이상이거나, 매칭된 카드는 클릭 무시
    if (selectedCards.includes(block) || selectedCards.length >= 2 || block.isMatched) return;

    // 새로운 선택된 카드 배열 업데이트
    const newSelectedCards = [...selectedCards, block];
    setSelectedCards(newSelectedCards);

    // 선택된 카드가 2개가 되었을 때
    if (newSelectedCards.length === 2) {
      // 짝이 맞는지 확인 (id가 같고, type이 다른 경우)
      if (newSelectedCards[0].id === newSelectedCards[1].id && newSelectedCards[0].type !== newSelectedCards[1].type) {
        showModal('맞았습니다! 😊', true); // 맞았다는 모달 표시
        setCorrectWords((prevWords) => [
          ...prevWords,
          { id: newSelectedCards[0].id, word: newSelectedCards.find((card) => card.type === 'word').content },
        ]);
        setCorrectAnswer((prevCount) => prevCount + 1); // 정답 개수 증가

        // 1초 후 매칭된 카드 업데이트
        setTimeout(() => {
          setBlocks((prevBlocks) =>
            prevBlocks.map((b) => (b.id === newSelectedCards[0].id ? { ...b, isMatched: true } : b)),
          );
          setSelectedCards([]); // 선택된 카드 초기화

          // 남은 매칭되지 않은 카드가 2장 이하이면 다음 라운드로 넘어감
          if (blocks.filter((b) => !b.isMatched).length === 2) {
            handleNextRound(true);
          }
        }, 1000);
      } else {
        // 짝이 맞지 않는 경우
        showModal('틀렸습니다. 😞', false); // 틀렸다는 모달 표시
        setIncorrectAnswer((prevCount) => prevCount + 1); // 틀린 시도 횟수 증가
        setTimeout(() => {
          setSelectedCards([]); // 선택된 카드 초기화
        }, 1000);
      }
    }
  };

  const handleRetry = () => {
    setIsResultModalOpen(false);
    setRound(0);
    setCorrectAnswer(0);
    setTotalPlayTime(0);
    setCorrectWords([]);
    updateRoundData(data[0]);
    resumeTimer();
  };

  const handleQuit = async () => {
    const totalAttempts = correctAnswer + incorrectAnswer; // 총 시도 횟수
    const correctRate = totalAttempts > 0 ? correctAnswer / (totalAttempts + (totalRounds * 4 - correctAnswer)) : 0; // 정답률 계산

    const resultData = {
      kidId: kidId,
      answerWords: correctWords,
      gameType: 'PAIR_GAME',
      playTime: totalPlayTime,
      correctRate: correctRate,
      correctCount: correctAnswer,
    };

    try {
      await fetchGameResult(accessToken, resultData);
      nav('/home');
    } catch (err) {
      showModal('결과 전송에 실패했습니다.');
    }
  };

  if (isDataLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          fontSize: '18px',
          zIndex: 1000,
        }}>
        게임 정보를 불러오는 중이에요!
      </div>
    );
  }

  return (
    <div className="game3-page">
      <PortraitModeWarning />

      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          <img src="/icons/arrow_back.svg" alt="뒤로가기" />
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">
          {round + 1} / {totalRounds}
        </div>
      </section>

      <button
        className="top-nav__guide-button"
        onClick={() => setIsGuideOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'absolute',
          top: '10px',
          right: '5px',
          fontSize: '20px',
        }}>
        <FaQuestionCircle />
      </button>

      <section className="main-content">
        {blocks.map((block) => (
          <div
            key={`${block.id}-${block.type}`}
            className={`main-content__card ${selectedCards.includes(block) ? 'main-content__card--selected' : ''}`}
            style={{ visibility: block.isMatched ? 'hidden' : 'visible' }}
            onClick={() => handleCardClick(block)}>
            {block.type === 'image' ? (
              <img src={block.content} alt="Game Image" className="main-content__card--img" />
            ) : (
              <div className="main-content__card--word">{block.content}</div>
            )}
          </div>
        ))}
      </section>

      <GameModal
        isOpen={isModalOpen}
        message={modalMessage}
        isCorrect={isCorrect}
        onRequestClose={() => setIsModalOpen(false)}
      />
      <ResultModal
        isOpen={isResultModalOpen}
        correctAnswer={(correctAnswer * 5) / 12}
        totalRounds={5}
        onRetry={handleRetry}
        onQuit={handleQuit}
      />

      <GameGuide isOpen={isGuideOpen} onRequestClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default Game3Page;
