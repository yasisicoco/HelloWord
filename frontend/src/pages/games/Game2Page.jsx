import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSelector } from 'react-redux';
import { FaQuestionCircle } from 'react-icons/fa';
import ConfirmationModal from '../../components/ConfirmationModal'; // 뒤로가기 확인 모달 추가

// API import
import { fetchGame2, fetchGameResult } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import ResultModal from '../../components/ResultModal';
import useTimer from '../../hooks/useTimer';
import Game2Guide from '../../components/Game2Guide';

// style
import './Game2Page.sass';

const Game2Page = () => {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [round, setRound] = useState(0);
  const [word, setWord] = useState('');
  const [imageUrl, setImage] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(null);
  const [correctWordsList, setCorrectWordsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [roundFinished, setRoundFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [countdown, setCountdown] = useState(3); // 카운트다운 상태
  const [gameStarted, setGameStarted] = useState(false); // 게임 시작 상태

  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // 시간 초과 시 라운드 넘기기
  const onTimeUp = () => {
    if (!roundFinished) {
      showModal('시간이 초과되었습니다. 틀렸습니다 😞', false);
    }
  };

  const { timeLeft, resetTimer, pauseTimer, resumeTimer } = useTimer(10, onTimeUp);

  const showModal = (message, isCorrect) => {
    if (roundFinished) return;
    setIsModalOpen(true);
    setModalMessage(message);
    pauseTimer();
    setIsCorrect(isCorrect);
    setRoundFinished(true);

    setTimeout(() => {
      setIsModalOpen(false);
      handleNextRound(isCorrect);
    }, 1000);
  };

  const updateRoundData = (currentRoundData) => {
    setWord(currentRoundData.word);
    setImage(currentRoundData.imageUrl);
    resetTimer();
    resetTranscript();
    setRoundStartTime(Date.now());
    setRoundFinished(false);
  };

  const fetchGameData = useCallback(async () => {
    if (!accessToken) return;
    setIsDataLoading(true);
    try {
      const data = await fetchGame2(accessToken, kidId);
      setData(data.rounds);
      setIsGuideOpen(data.needsTutorial);
      setTotalRounds(data.rounds.length);
      if (data.rounds && data.rounds.length > 0) {
        updateRoundData(data.rounds[0]);
      }
    } catch (err) {
      showModal('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setIsDataLoading(false);
    }
  }, [accessToken, kidId]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  useEffect(() => {
    if (isGuideOpen) {
      pauseTimer();
    } else if (!gameStarted && countdown <= 0) {
      resumeTimer();
    }
  }, [isGuideOpen, gameStarted, countdown, pauseTimer, resumeTimer]);

  useEffect(() => {
    if (isGuideOpen) return;

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

  // 매 라운드가 끝날 때 마이크를 자동으로 끄기
  const handleNextRound = (isCorrect) => {
    SpeechRecognition.stopListening(); // 마이크 끄기
    setIsListening(false); // 마이크 상태 업데이트

    const roundEndTime = Date.now();
    const timeTaken = (roundEndTime - roundStartTime) / 1000;
    setTotalPlayTime((prevTime) => prevTime + timeTaken);

    if (isCorrect) {
      setCorrectAnswer((prevCount) => prevCount + 1);
      setCorrectWordsList((prevList) => [
        ...prevList,
        {
          id: data[round].wordId,
          word: data[round].word,
        },
      ]);
    }

    if (round === totalRounds - 1) {
      setTimeout(() => {
        setIsResultModalOpen(true);
        pauseTimer();
      }, 1000);
    } else {
      setRound((prevRound) => prevRound + 1);
    }
  };

  useEffect(() => {
    if (listening && transcript === word) {
      showModal('맞았습니다! 😊', true);
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else if (listening && transcript.length >= word.length && transcript !== word) {
      resetTranscript();
      showModal('틀렸습니다. 😞', false);
    }
  }, [transcript, listening, word]);

  // 다시하기 버튼 클릭 시 카운트다운 재시작
  const handleRetry = () => {
    setIsResultModalOpen(false);
    setRound(0);
    setCorrectAnswer(0);
    setTotalPlayTime(0);
    setCountdown(3); // 다시하기 시 카운트다운 재시작
    setGameStarted(false); // 게임 상태 초기화
    updateRoundData(data[0]);
  };

  const handleQuit = async () => {
    const correctRate = correctAnswer / totalRounds;
    const resultData = {
      kidId: kidId,
      answerWords: correctWordsList,
      gameType: 'SPEECH_GAME',
      playTime: totalPlayTime,
      correctRate: correctRate,
      correctCount: correctAnswer,
    };

    try {
      await fetchGameResult(accessToken, resultData);
      window.location.href = '/home';
    } catch (err) {
      showModal('결과 전송에 실패했습니다.');
    }
  };

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

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    setTimeout(() => {
      nav(-1);
    }, 2000);
    return <div>이 브라우저는 음성 인식을 지원하지 않습니다.</div>;
  }

  const closeGuide = () => {
    setIsGuideOpen(false);
    resumeTimer();
  };

  if (!gameStarted) {
    return (
      <div className="countdown-screen">
        {countdown > 0 ? countdown : '시작!'}
      </div>
    );
  }

  return (
    <div className="game2-page">
      <section className="top-nav">
        <button onClick={handleBackButtonClick} className="top-nav__back-space">
          <img src="/icons/arrow_back.svg" alt="뒤로가기" />
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">
          <button
            className="top-nav__guide-button"
            onClick={() => setIsGuideOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'absolute',
              fontSize: '20px',
              width: '30px',
              height: '30px',
              right: '5px',
            }}>
            <FaQuestionCircle style={{ width: '100%', height: '100%', zIndex: '9999' }} />
          </button>
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
            className={`main-content__card-container--mic-card ${isListening ? 'mic-on' : 'mic-off'}`}
            aria-label={listening ? '마이크 끄기' : '마이크 켜기'}>
            {listening ? <img src="/icons/mic_on.svg" alt="마이크 켜기" /> : <img src="/icons/mic_off.svg" alt="마이크 끄기" />}
          </div>
        </div>
      </section>

      <GameModal
        isOpen={isModalOpen}
        message={modalMessage}
        isCorrect={isCorrect}
        onRequestClose={() => setIsModalOpen(false)}
      />

      <ResultModal
        isOpen={isResultModalOpen}
        correctAnswer={correctAnswer}
        totalRounds={totalRounds}
        onRetry={handleRetry}
        onQuit={handleQuit}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        message="게임을 그만두시겠습니까?"
        onConfirm={handleConfirmBack}
        onCancel={handleCancelBack}
      />

      <Game2Guide isOpen={isGuideOpen} onRequestClose={closeGuide} />
    </div>
  );
};

export default Game2Page;