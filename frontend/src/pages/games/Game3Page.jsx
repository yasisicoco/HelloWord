import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaQuestionCircle } from 'react-icons/fa';
import ConfirmationModal from '../../components/ConfirmationModal'; // 뒤로가기 확인 모달 추가

// API import
import { fetchGame3, fetchGameResult } from '../../api/GameAPI';

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
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // 뒤로가기 확인 모달
  const [modalMessage, setModalMessage] = useState('');
  const [roundFinished, setRoundFinished] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [incorrectAnswer, setIncorrectAnswer] = useState(0); // 틀린 횟수 추가

  const [countdown, setCountdown] = useState(3); // 카운트다운 상태
  const [gameStarted, setGameStarted] = useState(false); // 게임 시작 상태

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

  useEffect(() => {
    if (isGuideOpen) {
      pauseTimer(); // 모달이 열리면 타이머 멈춤
    } else if (!gameStarted && countdown <= 0) {
      resumeTimer();
    }
  }, [isGuideOpen, gameStarted, countdown, pauseTimer, resumeTimer]);

  useEffect(() => {
    if (countdown > 0) {
      pauseTimer();
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      resetTimer();
      resumeTimer();
    }
  }, [countdown, gameStarted, pauseTimer, resetTimer, resumeTimer, isGuideOpen]);

  useEffect(() => {
    if (data && data[round]) {
      updateRoundData(data[round]);
      resetTimer();
      resumeTimer();
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
    // 이미 선택된 카드를 클릭하면 선택 해제
    if (selectedCards.includes(block)) {
      setSelectedCards((prevSelectedCards) =>
        prevSelectedCards.filter((selectedBlock) => selectedBlock !== block)
      );
      return;
    }

    // 카드가 이미 매칭되었거나 2개의 카드를 이미 선택한 경우 클릭 무시
    if (selectedCards.length >= 2 || block.isMatched) return;

    const newSelectedCards = [...selectedCards, block];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      if (
        newSelectedCards[0].id === newSelectedCards[1].id &&
        newSelectedCards[0].type !== newSelectedCards[1].type
      ) {
        showModal('맞았습니다! 😊', true);
        setCorrectWords((prevWords) => [
          ...prevWords,
          {
            id: newSelectedCards[0].id,
            word: newSelectedCards.find((card) => card.type === 'word').content,
          },
        ]);
        setCorrectAnswer((prevCount) => prevCount + 1);

        setTimeout(() => {
          setBlocks((prevBlocks) =>
            prevBlocks.map((b) =>
              b.id === newSelectedCards[0].id ? { ...b, isMatched: true } : b
            )
          );
          setSelectedCards([]);

          if (blocks.filter((b) => !b.isMatched).length === 2) {
            handleNextRound(true);
          }
        }, 1000);
      } else {
        showModal('틀렸습니다. 😞', false);
        setIncorrectAnswer((prevCount) => prevCount + 1);
        setTimeout(() => {
          setSelectedCards([]);
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
    setCountdown(3); // 다시하기 시 카운트다운 재시작
    setGameStarted(false); // 게임 상태 초기화
    updateRoundData(data[0]);
  };

  const handleQuit = async () => {
    const totalAttempts = correctAnswer + incorrectAnswer;
    const correctRate = totalAttempts > 0 ? correctAnswer / (totalAttempts + (totalRounds * 4 - correctAnswer)) : 0;

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

  const handleBackButtonClick = () => {
    setIsConfirmationOpen(true);
    pauseTimer();
  };

  const handleConfirmBack = () => {
    setIsConfirmationOpen(false);
    nav(-1);
  };

  const handleCancelBack = () => {
    setIsConfirmationOpen(false);
    resumeTimer();
  };

  // 가이드 모달 열기
  const openGuide = () => {
    setIsGuideOpen(true);
    pauseTimer(); // 가이드 모달이 열리면 타이머 멈추기
  };

  // 가이드 모달 닫기
  const closeGuide = () => {
    setIsGuideOpen(false);
    resumeTimer(); // 가이드 모달이 닫히면 타이머 재개
  };

  if (!gameStarted) {
    return <div className="countdown-screen">{countdown > 0 ? countdown : '시작!'}</div>;
  }

  return (
    <div className="game3-page">
      <section className="top-nav">
        <button onClick={handleBackButtonClick} className="top-nav__back-space">
          <img src="/icons/arrow_back.svg" alt="뒤로가기" />
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">
          <div
            className="top-nav__guide-button"
            onClick={openGuide}  // 가이드 열 때 타이머 멈추기
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "absolute",
              fontSize: "20px",
              width: "20px",
              height: "20px",
              right: "10px",
            }}>
            <FaQuestionCircle style={{ width: "100%", height: "100%", zIndex: "9999" }} />
          </div>
          {round + 1} / {totalRounds}
        </div>
      </section>

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

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        message="게임을 그만두시겠습니까?"
        onConfirm={handleConfirmBack}
        onCancel={handleCancelBack}
      />

      <GameGuide isOpen={isGuideOpen} onRequestClose={closeGuide} />
    </div>
  );
};

export default Game3Page;
