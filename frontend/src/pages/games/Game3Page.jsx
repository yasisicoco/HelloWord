// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

// API import
import { fetchGame3, fecthGameResult } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import GameResult from '../../components/GameResult';
import useTimer from '../../hooks/useTimer';

// style
import './Game3Page.sass';

const Game3Page = () => {
  const nav = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [data, setData] = useState(null);
  const [round, setRound] = useState(0);
  const [words, setWords] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [gameStartTime, setGameStartTime] = useState(null);
  const [correctWords, setCorrectWords] = useState([]);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const kidId = useSelector((state) => state.kid.selectedKidId);

  // Fisher-Yates 알고리즘을 사용하여 배열을 섞는 함수
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const shuffledBlocks = useMemo(() => shuffleArray([...blocks]), [blocks]);

  const showModal = (message) => {
    setIsModalOpen(true);
    setModalMessage(message);
    setTimeout(() => setIsModalOpen(false), 1000);
  };

  const nextRound = () => {
    if (blocks && round < blocks.length / 4 - 1) {
      const nextRoundIndex = round + 1;
      setRound(nextRoundIndex);
      resetTimer();
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setIsLoading(true);
    const endTime = new Date();
    const playTime = Math.round((endTime - gameStartTime) / 1000);
    const correctRate = correctAnswer / (blocks.length / 4);

    const gameResult = {
      kidId: kidId,
      answerWords: correctWords,
      gameType: 'SPEECH_GAME',
      playTime: playTime,
      correctRate: correctRate,
      correctCount: correctAnswer,
    };

    try {
      await fecthGameResult(accessToken, gameResult);
    } catch (error) {
      console.error('게임 결과 저장 실패:', error);
      showModal('게임 결과 저장에 실패했습니다. 그러나 결과를 확인할 수 있습니다.');
    } finally {
      // 성공하든 실패하든 3초 후에 로딩을 끝내고 결과 창을 표시
      setTimeout(() => {
        setIsLoading(false);
        setIsResultOpen(true);
      }, 3000);
    }
  };

  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 틀렸습니다 😞');
    setTimeout(nextRound, 1000);
  };

  // TimeBar 시간초 관리 Effect
  const { timeLeft, resetTimer } = useTimer(10, onTimeUp);

  // 첫 렌더링 시 토큰, 데이터, 이미지, 단어 받아오는 Effect
  useEffect(() => {
    const fetchGameData = async () => {
      if (!accessToken) return;
      try {
        const rounds = await fetchGame3(accessToken, kidId);

        if (rounds && rounds.length > 0) {
          const allBlocks = rounds.flatMap((round) =>
            round.words.map((word) => ({
              word_id: word.word_id,
              word: word.word,
              imageUrl: word.imageUrl,
            })),
          );

          setBlocks(allBlocks);
          setGameStartTime(new Date());
        } else {
          showModal('데이터가 없습니다.');
        }
      } catch (err) {
        showModal('데이터를 불러오는 데 실패했습니다.');
      }
    };
    fetchGameData();
  }, [accessToken]);

  return (
    <div className="game3-page">
      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          뒤로가기
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar className="top-nav__time-stamp--timebar" time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">
          {round + 1} / {blocks.length / 4}
        </div>
      </section>
      <section className="main-content">
        {shuffledBlocks.map((wordData, index) => (
          <React.Fragment key={wordData.word_id}>
            <div className="main-content__card">
              {wordData.imageUrl ? (
                <img className="main-content__card--img" src={wordData.imageUrl} alt={`Game Image ${index + 1}`} />
              ) : (
                <p>No image</p>
              )}
            </div>
            <div className="main-content__card">{wordData.word}</div>
          </React.Fragment>
        ))}
      </section>
      {isModalOpen && <GameModal message={modalMessage} />}
      {isResultOpen && (
        <GameResult correctAnswer={correctAnswer} totalQuestions={data ? data.length : 0} correctWords={correctWords} />
      )}
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default Game3Page;
