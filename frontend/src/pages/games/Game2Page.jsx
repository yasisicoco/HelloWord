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
  const [isCorrect, setIsCorrect] = useState(null);
  const [totalRounds, setTotalRounds] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(null);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const kidId = useSelector((state) => state.kid.selectedKidId);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // 시간 초과 시 라운드 넘기기
  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 😞', false);
    handleNextRound(false);
  };

  // 모달 표시 함수
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

  const { timeLeft, resetTimer, pauseTimer, resumeTimer } = useTimer(10, onTimeUp);

  // 다음 라운드로 이동하는 함수
  const handleNextRound = (isCorrect) => {
    const roundEndTime = Date.now();
    const timeTaken = (roundEndTime - roundStartTime) / 1000;
    setTotalPlayTime((prevTime) => prevTime + timeTaken);

    if (isCorrect) {
      setCorrectAnswer((prevCount) => prevCount + 1);
      setCorrectWords((prevList) => [
        ...prevList,
        {
          id: data[round].wordId,
          word: data[round].word,
        },
      ]);
    }

    if (round < totalRounds - 1) {
      const nextRoundIndex = round + 1;
      setRound(nextRoundIndex);
      setWord(data[nextRoundIndex].word);
      setImage(data[nextRoundIndex].imageUrl);
      resetTimer();
      resetTranscript();
      setRoundStartTime(Date.now());
    } else {
      sendGameResult();
    }
  };

  // 게임 데이터 가져오기
  const fetchGameData = useCallback(async () => {
    if (!accessToken) return;

    setIsDataLoading(true);
    try {
      const rounds = await fetchGame2(accessToken, kidId);
      if (rounds && rounds.length > 0) {
        setData(rounds);
        setWord(rounds[0].word);
        setImage(rounds[0].imageUrl);
        setGameStartTime(new Date());
        setTotalRounds(rounds.length);
        setRoundStartTime(Date.now());
      } else {
        showModal('게임 데이터가 비어있습니다.', false);
      }
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
      showModal('데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.', false);
    } finally {
      setIsDataLoading(false);
    }
  }, [accessToken, kidId]);

  // 게임 결과 전송 함수
  const sendGameResult = async () => {
    if (!data) return;
    setIsLoading(true);
    const correctRate = correctAnswer / totalRounds;

    const gameResult = {
      kidId: kidId,
      answerWords: correctWords,
      gameType: 'SPEECH_GAME',
      playTime: Math.round(totalPlayTime),
      correctRate: correctRate,
      correctCount: correctAnswer,
    };

    try {
      await fetchGameResult(accessToken, gameResult);
      nav('/home');
    } catch (err) {
      showModal('결과 전송에 실패했습니다.', false);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  // 음성 인식 결과 처리
  useEffect(() => {
    if (listening) {
      if (transcript === word) {
        showModal('정답입니다! 🎉', true);
        handleNextRound(true);
      } else if (transcript.length >= word.length && transcript !== word) {
        resetTranscript();
        showModal('틀렸습니다 😞', false);
      }
    }
  }, [transcript, listening, word, round, data]);

  // 마이크 토글 함수
  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
      setIsListening(true);
    }
  };

  // 마이크 상태 가져오기
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
          {round + 1} / {totalRounds}
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
        isCorrect={isCorrect}
        onRequestClose={() => setIsModalOpen(false)}
      />
      <GameResult
        isOpen={isResultOpen}
        onClose={() => {
          setIsResultOpen(false);
        }}
        correctCount={correctAnswer}
        totalQuestions={totalRounds}
      />
    </div>
  );
};

export default Game2Page;
