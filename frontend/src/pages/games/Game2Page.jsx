import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSelector } from 'react-redux';
import { FaQuestionCircle } from 'react-icons/fa';

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
  const [isGuideOpen, setIsGuideOpen] = useState(true); // 가이드 모달
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [roundFinished, setRoundFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // 시간초과
  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 틀렸습니다 😞', false);
    SpeechRecognition.stopListening(); // 듣기 멈추기
    setIsListening(false); // 마이크 테두리
    resetTranscript(); // 내용 초기화
    handleNextRound(false); // 틀림표시 + 다음라운드로
  };

  // 모달 띄우기
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

  // 라운드 데이터 받아오기
  const updateRoundData = (currentRoundData) => {
    setWord(currentRoundData.word);
    setImage(currentRoundData.imageUrl);
    resetTimer();
    resetTranscript();
    setRoundStartTime(Date.now());
  };

  // 게임데이터 GET
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

  // 다음 라운드
  const handleNextRound = (isCorrect) => {
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

    setRoundFinished(true);
  };

  // 결과창 띄우기
  useEffect(() => {
    if (roundFinished) {
      if (round === totalRounds - 1) {
        SpeechRecognition.stopListening();
        setIsListening(false);
        setTimeout(() => {
          setIsResultModalOpen(true);
          pauseTimer();
        }, 1000);
      } else {
        setRound((prevRound) => prevRound + 1);
      }
      setRoundFinished(false);
    }
  }, [roundFinished, round, totalRounds]);

  // 듣기
  useEffect(() => {
    if (listening) {
      if (transcript === word) {
        showModal('맞았습니다! 😊', true);
        SpeechRecognition.stopListening();
        setIsListening(false);
        handleNextRound(true);
      } else if (transcript.length >= word.length && transcript !== word) {
        resetTranscript();
        showModal('틀렸습니다. 😞', false);
        // handleNextRound(false);
      }
    }
  }, [transcript, listening, word]);

  // 다시하기
  const handleRetry = () => {
    setIsResultModalOpen(false);
    setRound(0);
    setCorrectAnswer(0);
    setTotalPlayTime(0);
    updateRoundData(data[0]);
    setIsListening(false);
    resumeTimer();
  };

  // 그만하기
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
      // nav('/home');
      window.location.href = '/home'; // 새로고침하면서 홈으로
    } catch (err) {
      showModal('결과 전송에 실패했습니다.');
    }
  };

  const backButton = () => {
    SpeechRecognition.stopListening();
    nav(-1);
  };

  // 마이크 버튼
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

  // 스타일
  const getMicState = useCallback(() => {
    return isListening ? 'mic-on' : 'mic-off';
  }, [isListening]);

  // 지원안하는 브라우저는 2초뒤 뒤로가기
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    setTimeout(() => {
      nav(-1);
    }, 2000);
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
      <section className="top-nav">
        <button onClick={backButton} className="top-nav__back-space">
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
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "absolute",
              fontSize: "20px",
              width: "30px",
              height: "30px",
              right: "5px",
            }}>
            <FaQuestionCircle style={{ width: "100%", height: "100%", zIndex: "9999" }} />
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
            className={`main-content__card-container--mic-card card-container--${getMicState()}`}
            aria-label={listening ? '마이크 끄기' : '마이크 켜기'}>
            {listening ? <img src="/icons/mic_on.svg" /> : <img src="/icons/mic_off.svg" />}
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

      <Game2Guide isOpen={isGuideOpen} onRequestClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default Game2Page;
