// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSelector } from 'react-redux';

// API import
import { fetchGame2, fetchGameResult } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import GameResult from '../../components/GameResult';
import useTimer from '../../hooks/useTimer';

// style
import './Game2Page.sass';

const Game2Page = () => {
  const nav = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [data, setData] = useState(null);
  const [round, setRound] = useState(0);
  const [word, setWord] = useState('');
  const [imageUrl, setImage] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [gameStartTime, setGameStartTime] = useState(null);
  const [correctWords, setCorrectWords] = useState([]);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부 상태 추가

  const accessToken = useSelector((state) => state.auth.accessToken);
  const kidId = useSelector((state) => state.kid.selectedKidId);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const showModal = useCallback((message) => {
    setIsModalOpen(true);
    setModalMessage(message);
    pauseTimer(); // 모달이 열리면 타이머 일시정지
    setTimeout(() => {
      setIsModalOpen(false);
      resumeTimer(); // 모달이 닫히면 타이머 재개
    }, 1000);
  }, []);

  const nextRound = () => {
    if (data && round < data.length - 1) {
      const nextRoundIndex = round + 1;
      setRound(nextRoundIndex);
      setWord(data[nextRoundIndex].word);
      setImage(data[nextRoundIndex].imageUrl);
      resetTimer();
      resetTranscript();
    } else if (data) {
      endGame();
    }
  };

  const resetGame = useCallback(() => {
    setRound(0);
    setWord('');
    setImage('');
    setCorrectAnswer(0);
    setCorrectWords([]);
    setGameStartTime(null);
    setIsResultOpen(false);
    setIsLoading(false);
    resetTranscript();
  }, [resetTranscript]);

  const fetchGameData = useCallback(async () => {
    if (!accessToken) return;

    setIsDataLoading(true);
    try {
      const rounds = await fetchGame2(accessToken, kidId);
      if (rounds && rounds.length > 0) {
        console.log(rounds);
        setData(rounds);
        setWord(rounds[0].word);
        setImage(rounds[0].imageUrl);
        setGameStartTime(new Date());
      } else {
        showModal('게임 데이터가 비어있습니다.');
      }
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
      showModal('데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsDataLoading(false);
    }
  }, [accessToken, kidId]);

  useEffect(() => {
    resetGame();
    fetchGameData();
  }, [resetGame, fetchGameData]);

  const endGame = async () => {
    if (!data) return;
    setIsLoading(true);
    const endTime = new Date();
    const playTime = Math.round((endTime - gameStartTime) / 1000);
    const correctRate = correctAnswer / data.length;

    const gameResult = {
      kidId: kidId,
      answerWords: correctWords,
      gameType: 'SPEECH_GAME',
      playTime: playTime,
      correctRate: correctRate,
      correctCount: correctAnswer,
    };

    try {
      await fetchGameResult(accessToken, gameResult);
    } catch (error) {
      console.error('게임 결과 저장 실패:', error);
      showModal('게임 결과 저장에 실패했습니다. 그러나 결과를 확인할 수 있습니다.');
    } finally {
      // 성공하든 실패하든 3초 후에 로딩을 끝내고 결과 창을 표시합니다.
      setTimeout(() => {
        setIsLoading(false);
        setIsResultOpen(true);
      }, 3000);
    }
  };

  // 시간초과
  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 틀렸습니다 😞');
    setTimeout(nextRound, 1000);
  };

  // TimeBar 시간초 관리 Effect
  const { timeLeft, resetTimer, pauseTimer, resumeTimer } = useTimer(10, onTimeUp); // pauseTimer, resumeTimer 추가

  // 음성확인과 그에 따른 처리 Effect
  useEffect(() => {
    if (listening) {
      if (transcript === word) {
        setCorrectAnswer((prev) => prev + 1);
        setCorrectWords((prev) => [...prev, { id: data[round].wordId, word: transcript }]);
        showModal('정답입니다! 🎉');
        nextRound();
      } else if (transcript.length >= word.length && transcript !== word) {
        resetTranscript();
        showModal('틀렸습니다 😞');
      }
    }
  }, [transcript, listening, word, round, data, showModal, nextRound]);

  // 마이크 클릭 이벤트
  const toggleListening = useCallback(() => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
      setIsListening(true);
    }
  }, [isListening, resetTranscript]);

  const getMicState = useCallback(() => {
    return isListening ? 'mic-on' : 'mic-off';
  }, [isListening]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>이 브라우저는 음성 인식을 지원하지 않습니다.</div>;
  }

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
    <div className="game2-page">
      {isLoading && <div className="loading-overlay">로딩 중...</div>}
      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          뒤로가기
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">
          {round + 1} / {data ? data.length : 0}
        </div>
      </section>

      <section className="main-content">
        <div className="main-content__img-wrap">
          <img src={imageUrl} alt="캐릭터 이미지" className="main-content__img-wrap--img" />
        </div>
        <div className="main-content__card-container">
          <div className="main-content__card-container--word-card">{word}</div>
          <div
            onClick={toggleListening}
            className={`main-content__card-container--mic-card card-container--${getMicState()}`}
            aria-label={listening ? '마이크 끄기' : '마이크 켜기'}>
            {listening ? '마이크 끄기' : '마이크 켜기'}
          </div>
        </div>
      </section>

      <GameModal
        isOpen={isModalOpen}
        message={modalMessage}
        isCorrect={isCorrect} // 정답 여부 전달
        onRequestClose={() => setIsModalOpen(false)}
      />
      <GameResult
        isOpen={isResultOpen}
        onClose={() => {
          setIsResultOpen(false);
        }}
        correctCount={correctAnswer}
        totalQuestions={data ? data.length : 0}
      />
    </div>
  );
};

export default Game2Page;
