import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// API import
import { fetchGame3, fetchGameResult } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import useTimer from '../../hooks/useTimer';

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
  const [modalMessage, setModalMessage] = useState('');
  const [roundFinished, setRoundFinished] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [blocks, setBlocks] = useState([]);

  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 틀렸습니다 😞');
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
        const rounds = await fetchGame3(accessToken, kidId);
        setData(rounds);
        setTotalRounds(rounds.length);
        if (rounds && rounds.length > 0) {
          updateRoundData(rounds[0]);
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
    if (data && data[round]) {
      updateRoundData(data[round]);
    }
  }, [round, data]);

  const handleNextRound = (isAllCorrect) => {
    const roundEndTime = Date.now();
    const timeTaken = (roundEndTime - roundStartTime) / 1000;
    setTotalPlayTime((prevTime) => prevTime + timeTaken);

    if (isAllCorrect) {
      setCorrectAnswer((prevCount) => prevCount + 4); // 4 pairs per round
    }

    setRoundFinished(true);
  };

  useEffect(() => {
    if (roundFinished) {
      if (round === totalRounds - 1) {
        sendGameResult();
      } else {
        setRound((prevRound) => prevRound + 1);
      }
      setRoundFinished(false);
      setSelectedCards([]);
    }
  }, [roundFinished, round, totalRounds]);

  const handleCardClick = (block) => {
    if (selectedCards.includes(block) || selectedCards.length >= 2 || block.isMatched) return;

    const newSelectedCards = [...selectedCards, block];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      if (newSelectedCards[0].id === newSelectedCards[1].id && newSelectedCards[0].type !== newSelectedCards[1].type) {
        showModal('맞았습니다! 😊', true);
        setCorrectWords((prevWords) => [
          ...prevWords,
          { id: newSelectedCards[0].id, word: newSelectedCards.find((card) => card.type === 'word').content },
        ]);
        setTimeout(() => {
          setBlocks((prevBlocks) =>
            prevBlocks.map((b) => (b.id === newSelectedCards[0].id ? { ...b, isMatched: true } : b)),
          );
          setSelectedCards([]);
          if (blocks.filter((b) => !b.isMatched).length === 2) {
            handleNextRound(true);
          }
        }, 1000);
      } else {
        showModal('틀렸습니다. 😞', false);
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const sendGameResult = async () => {
    const correctRate = correctAnswer / (totalRounds * 4);
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
      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          뒤로가기
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">
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
    </div>
  );
};

export default Game3Page;
