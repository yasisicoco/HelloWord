// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSelector } from 'react-redux';

// API import
import { fetchGame2 } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';

// style
import './Game2Page.sass';

const Game2Page = () => {
  const nav = useNavigate();
  const [round, setRound] = useState(0);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [timeLeft, setTimeLeft] = useState(10);
  const [word, setWord] = useState('');
  const [imageUrl, setImage] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const accessToken = useSelector((state) => state.auth.accessToken);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const nextRound = useCallback(() => {
    if (data) {
      const nextRoundIndex = round + 1;
      setRound(nextRoundIndex);
      setWord(data[nextRoundIndex].word);
      setImage(data[nextRoundIndex].imageUrl);
      setTimeLeft(10);
      resetTranscript();
      if (listening) {
        SpeechRecognition.stopListening();
      }
    }
  }, [round, resetTranscript, listening, data]);

  useEffect(() => {
    const Game2Data = async () => {
      if (!accessToken) return;

      try {
        const rounds = await fetchGame2(accessToken, 2);
        setData(rounds);
        setWord(rounds[0].word);
        setImage(rounds[0].imageUrl);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.log('err:', error);
      }
    };

    Game2Data();
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
        const answer = correctAnswer + 1;
        setCorrectAnswer(answer);
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
    </div>
  );
};

export default Game2Page;
