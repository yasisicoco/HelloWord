// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSelector } from 'react-redux';

// API import
import { fetchGame2 } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import useTimer from '../../hooks/useTimer';

// style
import './Game2Page.sass';

const Game2Page = () => {
  const nav = useNavigate();
  const [round, setRound] = useState(0);
  const [word, setWord] = useState('');
  const [imageUrl, setImage] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0); // 맞은 갯수 카운팅
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달
  const [modalMessage, setModalMessage] = useState('');

  const accessToken = useSelector((state) => state.auth.accessToken);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [data, setData] = useState(null);

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
      // 게임 종료 로직
      // showModal('게임이 종료되었습니다!');
      // 필요한 경우 여기에 게임 종료 후 처리 로직 추가
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
        const rounds = await fetchGame2(accessToken, 2);
        setData(rounds);
        setWord(rounds[0].word);
        setImage(rounds[0].imageUrl);
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
        SpeechRecognition.stopListening();
        showModal('정답입니다! 🎉');
        nextRound();
        console.log('맞:', transcript);
      } else if (transcript.length >= word.length && transcript !== word) {
        SpeechRecognition.stopListening();
        resetTranscript();
        setIsModalOpen(true);
        showModal('틀렸습니다 😞');
        console.log('틀:', transcript);
      }
    }
  }, [transcript, listening, word, nextRound]);

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
    </div>
  );
};

export default Game2Page;
