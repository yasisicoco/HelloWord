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
  const [round, setRound] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [gameStartTime, setGameStartTime] = useState(null);
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
    if (round < 4) {
      setRound((prevRound) => prevRound + 1);
      setSelectedCards([]); // 선택된 카드 초기화
      resetTimer();
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setIsLoading(true);
    const endTime = new Date();
    const playTime = Math.round((endTime - gameStartTime) / 1000);
    const correctRate = correctAnswer / 20; // 총 5라운드, 라운드당 4개의 단어

    const gameResult = {
      kidId: kidId,
      answerWords: correctWords,
      gameType: 'PAIR_GAME',
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
        const rounds = await fetchGame3(accessToken, kidId); // API로부터 rounds 가져오기

        if (rounds && rounds.length >= 5) {
          const allRounds = rounds.map((round) =>
            shuffleArray(
              round.words.flatMap((word) => [
                { type: 'image', id: `${word.word_id}-image`, content: word.imageUrl },
                { type: 'word', id: `${word.word_id}-word`, content: word.word },
              ]),
            ),
          );
          setBlocks(allRounds);
          setGameStartTime(new Date());
        } else {
          showModal('데이터가 충분하지 않습니다.');
        }
      } catch (err) {
        showModal('데이터를 불러오는 데 실패했습니다.');
      }
    };
    fetchGameData();
  }, [accessToken]);

  const handleCardClick = (block) => {
    if (selectedCards.includes(block) || selectedCards.length >= 2) return;

    const newSelectedCards = [...selectedCards, block];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      if (
        newSelectedCards[0].type !== newSelectedCards[1].type &&
        newSelectedCards[0].id.split('-')[0] === newSelectedCards[1].id.split('-')[0]
      ) {
        // 카드가 매칭되었을 경우
        setCorrectAnswer((prev) => prev + 1);
        setCorrectWords((prevWords) => [...prevWords, newSelectedCards[0].id.split('-')[0]]);
        setTimeout(() => {
          setSelectedCards([]);
          if (correctAnswer + 1 === 4) {
            nextRound(); // 4개의 단어를 모두 맞추었을 때 다음 라운드로 넘어감
          }
        }, 500);
      } else {
        // 카드가 매칭되지 않았을 경우
        setTimeout(() => {
          setSelectedCards([]);
          showModal('틀렸습니다 😞');
        }, 1000);
      }
    }
  };

  const currentBlocks = useMemo(() => {
    if (blocks.length > round) {
      return blocks[round];
    }
    return [];
  }, [blocks, round]);

  return (
    <div className="game3-page">
      {isLoading && <div className="loading-overlay">로딩 중...</div>}
      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          뒤로가기
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar className="top-nav__time-stamp--timebar" time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">{round + 1} / 5</div>
      </section>

      <section className="main-content">
        {currentBlocks.map((block, index) => (
          <div
            key={block.id}
            className={`main-content__card ${selectedCards.includes(block) ? 'selected' : ''}`}
            onClick={() => handleCardClick(block)}>
            {block.type === 'image' ? (
              <img className="main-content__card--img" src={block.content} alt={`Game Image ${index + 1}`} />
            ) : (
              <div className="main-content__card--word">{block.content}</div>
            )}
          </div>
        ))}
      </section>

      <GameModal isOpen={isModalOpen} message={modalMessage} onRequestClose={() => setIsModalOpen(false)} />
      <GameResult
        isOpen={isResultOpen}
        onClose={() => {
          setIsResultOpen(false);
        }}
        correctCount={correctAnswer}
        totalQuestions={20} // 총 20개의 단어 (5 라운드 * 4 단어)
      />
    </div>
  );
};

export default Game3Page;
