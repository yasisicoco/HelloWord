// hook
import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// API import
import { fetchGame1, fetchGameResult } from '../../api/GameAPI';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import useTimer from '../../hooks/useTimer';
import ResultModal from '../../components/ResultModal';

// style
import './Game1Page.sass';

const Game1Page = () => {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState('');
  const [imageUrl, setImage] = useState('');
  const [voice, setVoice] = useState(''); // 목소리 URL 저장
  const [wrong0, setWrong0] = useState('');
  const [wrong1, setWrong1] = useState('');
  const [wrong2, setWrong2] = useState('');
  const [options, setOptions] = useState([]); // 랜덤으로 섞인 단어 저장
  const [correctAnswer, setCorrectAnswer] = useState(0); // 맞은 갯수 카운팅
  const [totalRounds, setTotalRounds] = useState(0); // 총 라운드 수 저장
  const [totalPlayTime, setTotalPlayTime] = useState(0); // 전체 플레이 시간 저장
  const [roundStartTime, setRoundStartTime] = useState(null); // 각 라운드 시작 시간
  const [correctWordsList, setCorrectWordsList] = useState([]); // 맞춘 단어 저장 리스트
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // 결과 모달
  const [modalMessage, setModalMessage] = useState('');
  const [roundFinished, setRoundFinished] = useState(false); // 라운드 완료 여부 상태 추가
  const [isDataLoading, setIsDataLoading] = useState(true);
  const kidId = useSelector((state) => state.kid.selectedKidId); // 선택된 아이 ID 확인
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부 상태 추가

  // 시간 초과 시 라운드 넘기기
  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 틀렸습니다 😞');
    handleNextRound(false); // 타임아웃 시 틀린 것으로 처리
  };

  const showModal = (message, isCorrect) => {
    setIsModalOpen(true);
    setModalMessage(message);
    pauseTimer(); // 모달이 열리면 타이머 일시정지
    setTimeout(() => {
      setIsModalOpen(false);
      resumeTimer(); // 모달이 닫히면 타이머 재개
    }, 1000);
    setIsCorrect(isCorrect); // 정답 여부 상태 저장
  };

  const { timeLeft, resetTimer, pauseTimer, resumeTimer } = useTimer(10, onTimeUp); // pauseTimer, resumeTimer 추가

  // 단어 배열을 무작위로 섞는 함수
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // 라운드 데이터 갱신 함수
  const updateRoundData = (currentRoundData) => {
    const correctWord = currentRoundData.correctWord.word;
    const incorrectWords = [
      currentRoundData.incorrectWords[0]?.word || '',
      currentRoundData.incorrectWords[1]?.word || '',
      currentRoundData.incorrectWords[2]?.word || '',
    ];

    setCorrect(correctWord);
    setImage(currentRoundData.correctWord.imageUrl);
    setVoice(currentRoundData.correctWord.voiceUrl); // 목소리 URL 설정
    setWrong0(incorrectWords[0]);
    setWrong1(incorrectWords[1]);
    setWrong2(incorrectWords[2]);

    // correct와 incorrectWords를 하나의 배열로 합친 후 무작위로 섞기
    const shuffledOptions = shuffleArray([correctWord, ...incorrectWords]);
    setOptions(shuffledOptions); // 섞인 단어를 상태에 저장

    resetTimer(); // 타이머 리셋
    setRoundStartTime(Date.now()); // 라운드 시작 시간 기록
  };

  // 첫 렌더링 시 데이터 가져오기
  useEffect(() => {
    const fetchGameData = async () => {
      if (!accessToken) return; // hey im babo jinwoo.!!!
      setIsDataLoading(true);
      try {
        const rounds = await fetchGame1(accessToken, kidId);
        setData(rounds); // 전체 데이터를 저장
        setTotalRounds(rounds.length); // 총 라운드 수 설정
        setVoice(rounds[0].correctWord.voiceUrl); // 첫 번째 라운드의 목소리 URL 저장
        if (rounds && rounds.length > 0) {
          updateRoundData(rounds[0]); // 첫 번째 라운드 데이터 설정
        }
      } catch (err) {
        showModal('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchGameData();
  }, [accessToken, kidId]);

  // 라운드가 변경될 때마다 데이터를 업데이트하는 useEffect
  useEffect(() => {
    if (data && data[round]) {
      updateRoundData(data[round]); // 현재 라운드에 맞는 데이터 갱신
    }
  }, [round, data]);

  // 정답 맞춤 여부에 따라 다음 라운드로 이동
  const handleNextRound = (isCorrect) => {
    const roundEndTime = Date.now();
    const timeTaken = (roundEndTime - roundStartTime) / 1000; // 초 단위로 계산
    setTotalPlayTime((prevTime) => prevTime + timeTaken); // 플레이 시간 합산

    // 정답일 경우 맞춘 단어 기록
    if (isCorrect) {
      setCorrectAnswer((prevCount) => prevCount + 1); // 정답 갯수 증가
      setCorrectWordsList((prevList) => [
        ...prevList, // hey im babo jinwoo.!!!
        {
          id: data[round].correctWord.wordId, // 정답 단어의 ID
          word: data[round].correctWord.word, // 정답 단어
        },
      ]);
    }

    setRoundFinished(true); // 라운드가 완료되었음을 표시
  };

  // roundFinished가 true가 되면 다음 라운드로 이동
  useEffect(() => {
    if (roundFinished) {
      if (round === totalRounds - 1) {
        setTimeout(() => {
          setIsResultModalOpen(true); // 마지막 라운드에서 결과 모달 열기
          pauseTimer(); // 타이머 정지
        }, 1000); // GameModal이 닫힌 후 결과 모달 띄우기
      } else {
        setRound((prevRound) => prevRound + 1);
      }
      setRoundFinished(false); // 라운드 완료 상태 초기화
    }
  }, [roundFinished, round, totalRounds]);

  // 단어 클릭 시 정답 확인 함수
  const handleOptionClick = (selectedOption) => {
    const isCorrect = selectedOption === correct; // 정답 여부를 확인
    if (isCorrect) {
      showModal('맞았습니다! 😊', true); // 정답일 때 true
      handleNextRound(true); // 정답 처리 후 다음 라운드로 이동
    } else {
      showModal('틀렸습니다. 😞', false); // 오답일 때 false
      handleNextRound(false); // 틀림 처리 후 다음 라운드로 이동
    }
  };

  // 다시하기 버튼 클릭 시
  const handleRetry = () => {
    setIsResultModalOpen(false);
    setRound(0); // 게임을 다시 시작
    setCorrectAnswer(0); // 맞은 갯수 초기화
    setTotalPlayTime(0); // 전체 플레이 시간 초기화
    updateRoundData(data[0]); // 첫 라운드로 다시 시작
    resumeTimer(); // 모달이 닫히면 타이머 재개
  };

  // 그만하기 버튼 클릭 시
  const handleQuit = async () => {
    const correctRate = correctAnswer / totalRounds;
    const resultData = {
      kidId: kidId,
      answerWords: correctWordsList,
      gameType: 'SPEED_GAME',
      playTime: totalPlayTime,
      correctRate: correctRate,
      correctCount: correctAnswer,
    };

    try {
      await fetchGameResult(accessToken, resultData);
      nav('/home'); // 홈으로 이동
    } catch (err) {
      showModal('결과 전송에 실패했습니다.');
    }
  };

  // 오디오 재생 함수
  const playVoice = () => {
    if (voice) {
      const audio = new Audio(voice); // voice URL을 사용하여 오디오 객체 생성
      audio.play(); // 오디오 재생
    } else {
      showModal('재생할 음성이 없습니다.');
    }
  };

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
    <div className="game1-page">
      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          <img src="/icons/arrow_back.svg" alt="뒤로가기" />
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
          {options.map((option, index) => (
            <div // 싫어.
              key={index}
              className="main-content__card-container--card-wrap"
              onClick={() => handleOptionClick(option)}>
              {option}
            </div>
          ))}
        </div>
      </section>

      <section className="footer">
        <button className="footer__play-button" onClick={playVoice}>
          재생하기
        </button>
      </section>

      {/* 게임 모달 */}
      <GameModal
        isOpen={isModalOpen}
        message={modalMessage}
        isCorrect={isCorrect}
        onRequestClose={() => setIsModalOpen(false)}
      />

      {/* 결과 모달 */}
      <ResultModal
        isOpen={isResultModalOpen}
        correctAnswer={correctAnswer}
        totalRounds={totalRounds}
        onRetry={handleRetry}
        onQuit={handleQuit}
      />
    </div>
  );
};

export default Game1Page;
