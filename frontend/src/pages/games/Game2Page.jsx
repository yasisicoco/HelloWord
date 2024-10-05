// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { useSelector } from 'react-redux';

// compo
import TimeBar from '../../components/TimeBar';

// style
import './Game2Page.sass';

const mockdata = {
  success: true,
  status: 200,
  data: {
    rounds: [
      { word_id: 1, word: '포도', image_url: '단어이미지1' },
      { word_id: 2, word: '딸기', image_url: '단어이미지2' },
      { word_id: 3, word: '사과', image_url: '단어이미지3' },
      { word_id: 4, word: '수박', image_url: '단어이미지4' },
      { word_id: 5, word: '토마토', image_url: '단어이미지5' },
    ],
  },
};

const Game2Page = () => {
  const nav = useNavigate();
  const [round, setRound] = useState(0);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [word, setWord] = useState(mockdata.data.rounds[0].word);
  const [timeLeft, setTimeLeft] = useState(10);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const nextRound = useCallback(() => {
    const nextRoundIndex = (round + 1) % mockdata.data.rounds.length;
    setRound(nextRoundIndex);
    setWord(mockdata.data.rounds[nextRoundIndex].word);
    setTimeLeft(10);
    resetTranscript();
    if (listening) {
      SpeechRecognition.stopListening();
    }
  }, [round, resetTranscript, listening]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://j11b206.p.ssafy.io/api/games/speech-cards?kidId=${2}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data.success && response.data.status === 200) {
          setData(response.data.data.rounds);
          console.log(response.data);
        } else {
          throw new Error('서버 응답이 올바르지 않습니다.');
        }
      } catch (err) {
        console.error('데이터 불러오기 실패:', err.message);
        setError('데이터를 불러오는 데 실패했습니다.');
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0.1) {
          nextRound();
          return 10;
        }
        return prevTime - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [nextRound]);

  useEffect(() => {
    if (listening) {
      if (transcript === word) {
        nextRound();
        console.log('맞:', transcript);
      } else if (transcript.length >= word.length && transcript !== word) {
        SpeechRecognition.stopListening();
        resetTranscript();
        console.log('틀:', transcript);
      }
    }
  }, [transcript, listening, word, nextRound]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
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
          {round + 1} / {mockdata.data.rounds.length}
        </div>
      </section>

      <section className="main-content">
        <div className="main-content__img-wrap">
          <img src="/character/rabbit.png" alt="캐릭터 이미지" className="main-content__img-wrap--img" />
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
    </div>
  );
};

export default Game2Page;
