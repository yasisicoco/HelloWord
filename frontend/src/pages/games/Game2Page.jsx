// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSelector } from 'react-redux';

// API import
import { fetchGame2, fecthGameResult } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import GameResult from '../../components/GameResult';
import useTimer from '../../hooks/useTimer';

// style
import './Game2Page.sass';

const Game2Page = () => {
  const nav = useNavigate();
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

  const accessToken = useSelector((state) => state.auth.accessToken);
  const kidId = useSelector((state) => state.kid.selectedKidId);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const showModal = (message) => {
    setIsModalOpen(true);
    setModalMessage(message);
    setTimeout(() => setIsModalOpen(false), 1000);
  };

  const nextRound = () => {
    if (data && round < data.length - 1) {
      const nextRoundIndex = round + 1;
      setRound(nextRoundIndex);
      setWord(data[nextRoundIndex].word);
      setImage(data[nextRoundIndex].imageUrl);
      resetTimer();
      resetTranscript();
    } else {
      endGame();
    }
  };

  const endGame = async () => {
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
      await fecthGameResult(accessToken, gameResult);
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
        const rounds = await fetchGame2(accessToken, kidId);
        setData(rounds);
        setWord(rounds[0].word);
        setImage(rounds[0].imageUrl);
        setGameStartTime(new Date());
      } catch (err) {
        showModal('데이터를 불러오는 데 실패했습니다.');
      }
    };
    fetchGameData();
  }, [accessToken]);

  // 음성확인과 그에따른 처리 Effect
  useEffect(() => {
    if (listening) {
      if (transcript === word) {
        setCorrectAnswer((answer) => answer + 1);
        setCorrectWords([...correctWords, { id: data[round].id, word: transcript }]); //맞은 단어 넣기
        SpeechRecognition.stopListening();
        showModal('정답입니다! 🎉');
        console.log('맞:', transcript);
        nextRound();
      } else if (transcript.length >= word.length && transcript !== word) {
        SpeechRecognition.stopListening();
        console.log('틀:', transcript);
        resetTranscript();
        showModal('틀렸습니다 😞');
        setTimeout(nextRound, 2000);
      }
    }
  }, [transcript, listening, word]);

  // 마이크 클릭 이벤트
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    }
  };

  const getMicState = () => {
    if (!listening) return 'mic-off';
    return listening ? 'mic-on' : 'mic-wait';
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>이 브라우저는 음성 인식을 지원하지 않습니다.</div>;
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

      <GameModal isOpen={isModalOpen} message={modalMessage} onRequestClose={() => setIsModalOpen(false)} />
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
