// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
  const round = useRef(0);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [word, setWord] = useState(mockdata.data.rounds[0].word);

  useEffect(() => {
    if (listening) {
      // console.log('Recognized Speech:', transcript);
      if (transcript === word) {
        round.current += 1;
        setWord(mockdata.data.rounds[round.current].word);
        SpeechRecognition.stopListening();
        resetTranscript();
        console.log('맞:', transcript);
      } else if (transcript.length >= word.length && transcript != word) {
        SpeechRecognition.stopListening();
        resetTranscript();
        console.log('틀:', transcript);
      }
    }
  }, [transcript, listening, word]);

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
          <TimeBar className="top-nav__time-stamp--timebar" time={10} />
        </div>
        <div className="top-nav__bookmarker">
          {round.current + 1} / {mockdata.data.rounds.length}
        </div>
      </section>

      <section className="main-content">
        <div className="main-content__img-wrap">
          <img src="/charactor/rabbit.png" alt="캐릭터 이미지" className="main-content__img-wrap--img" />
        </div>
        <div className="main-content__card-container">
          <div className="main-content__card-container--word-card">{mockdata.data.rounds[round.current].word}</div>
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
