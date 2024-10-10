import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaQuestionCircle } from 'react-icons/fa';
import ConfirmationModal from '../../components/ConfirmationModal'; // 뒤로가기 확인 모달 추가

// API import
import { fetchGame4, fetchGameResult } from '../../api/GameAPI';
import PortraitModeWarning from '../../features/Games/portraitModeWarning';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import useTimer from '../../hooks/useTimer';
import ResultModal from '../../components/ResultModal';
import GameGuide from '../../components/Game4Guide';

// style
import './Game4Page.sass';

const Game4Page = () => {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState('');
  const [imageUrl, setImage] = useState('');
  const [sentence, setSentence] = useState('');
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
  const [isGuideOpen, setIsGuideOpen] = useState(true); // 가이드 모달
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // 결과 모달
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // 뒤로가기 확인 모달
  const [modalMessage, setModalMessage] = useState('');
  const [roundFinished, setRoundFinished] = useState(false); // 라운드 완료 여부 상태 추가
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부 상태 추가

  const [countdown, setCountdown] = useState(3); // 카운트다운 상태
  const [gameStarted, setGameStarted] = useState(false); // 게임 시작 상태

  const kidId = useSelector((state) => state.kid.selectedKidId); // 선택된 아이 ID 확인
  const accessToken = useSelector((state) => state.auth.accessToken);

  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 틀렸습니다 😞');
    handleNextRound(false); // 타임아웃 시 틀린 것으로 처리
  };

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

  const { timeLeft, resetTimer, pauseTimer, resumeTimer } = useTimer(20, onTimeUp);

  // 단어 배열을 무작위로 섞는 함수
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // 정답을 빈칸으로 변환하는 함수
  const convertAnswerToBlanks = (sentence, answer) => {
    const blank = '□'; // 빈칸을 사각형으로 표현
    const blankSentence = sentence.replace(`##${answer}##`, blank.repeat(answer.length));
    return blankSentence;
  };

  // 라운드 데이터 갱신 함수
  const updateRoundData = (currentRoundData) => {
    const correctWord = currentRoundData.correctWord.word;
    const sentenceWithBlanks = convertAnswerToBlanks(currentRoundData.sentence, correctWord);

    const incorrectWords = [
      currentRoundData.incorrectWords[0]?.word || '',
      currentRoundData.incorrectWords[1]?.word || '',
      currentRoundData.incorrectWords[2]?.word || '',
    ];

    setCorrect(correctWord);
    setImage(currentRoundData.imageUrl);
    setSentence(sentenceWithBlanks); // 빈칸으로 변환된 문장 저장
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
      if (!accessToken) return;

      setIsDataLoading(true);
      try {
        const data = await fetchGame4(accessToken, kidId);
        setData(data.rounds); // 전체 데이터를 저장
        setTotalRounds(data.rounds.length); // 총 라운드 수 설정
        if (data.rounds && data.rounds.length > 0) {
          updateRoundData(data.rounds[0]); // 첫 번째 라운드 데이터 설정
          setIsGuideOpen(data.needsTutorial);
        }
      } catch (err) {
        showModal('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchGameData();
  }, [accessToken, kidId]);

  // 가이드 모달이 열릴 때 타이머 일시정지, 닫힐 때 타이머 재개
  useEffect(() => {
    if (isGuideOpen) {
      pauseTimer(); // 모달이 열리면 타이머 멈춤
    } else if (!gameStarted && countdown <= 0) {
      resumeTimer(); // 모달이 닫히면 타이머 재개
    }
  }, [isGuideOpen, gameStarted, countdown, pauseTimer, resumeTimer]);

  // 카운트다운이 진행되는 동안 시간 멈추기
  useEffect(() => {
    if (countdown > 0) {
      pauseTimer(); // 카운트다운 동안 타이머 멈추기
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000); // 1초마다 카운트다운 감소

      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      resetTimer(); // 타이머를 리셋하고
      resumeTimer(); // 카운트다운이 끝나면 타이머 시작
    }
  }, [countdown, gameStarted, pauseTimer, resetTimer, resumeTimer]);

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
        ...prevList,
        {
          id: data[round].correctWord.wordId, // 정답 단어의 ID
          word: data[round].correctWord.word, // 정답 단어
        },
      ]);
    }

    // roundFinished 상태로 다음 라운드로 이동하는 로직을 useEffect로 넘김
    setRoundFinished(true);
  };

  useEffect(() => {
    if (roundFinished) {
      if (round === totalRounds - 1) {
        // 마지막 라운드라면 결과 모달을 띄움
        setTimeout(() => {
          setIsResultModalOpen(true); // 마지막 라운드에서 결과 모달 열기
          pauseTimer(); // 타이머 정지
        }, 1000); // 결과 모달 띄우기 전에 잠시 대기
      } else {
        setTimeout(() => {
          setRound((prevRound) => prevRound + 1); // 다음 라운드로 이동
          setRoundFinished(false); // 라운드 완료 상태 초기화
          resumeTimer(); // 다음 라운드로 이동하면 타이머 재개
        }, 1000); // 모달 닫힌 후에 1초 후에 라운드 이동
      }
    }
  }, [roundFinished, round, totalRounds, resumeTimer]);

  // 단어 클릭 시 정답 확인 함수
  const handleOptionClick = (selectedOption) => {
    const isCorrect = selectedOption === correct; // 정답 여부를 확인
    if (isCorrect) {
      showModal('맞았습니다! 😊', true); // 정답일 때 true
    } else {
      showModal('틀렸습니다. 😞', false); // 오답일 때 false
    }
  };

  // 다시하기 버튼 클릭 시
  const handleRetry = () => {
    setIsResultModalOpen(false);
    setRound(0); // 게임을 다시 시작
    setCorrectAnswer(0); // 맞은 갯수 초기화
    setTotalPlayTime(0); // 전체 플레이 시간 초기화
    setCountdown(3); // 다시하기 시 카운트다운 재시작
    updateRoundData(data[0]); // 첫 라운드로 다시 시작
    setGameStarted(false); // 게임 상태 초기화
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

  // 뒤로가기 모달 열기
  const handleBackButtonClick = () => {
    setIsConfirmationOpen(true);
    pauseTimer(); // 모달이 열리면 타이머 멈추기
  };

  // 모달에서 "예" 클릭 시 뒤로가기
  const handleConfirmBack = () => {
    setIsConfirmationOpen(false);
    nav(-1);
  };

  // 모달에서 "아니오" 클릭 시 모달 닫기
  const handleCancelBack = () => {
    setIsConfirmationOpen(false);
    resumeTimer(); // 모달이 닫히면 타이머 재개
  };

  // 가이드 모달 열기
  const openGuide = () => {
    setIsGuideOpen(true);
    pauseTimer(); // 가이드 모달이 열리면 타이머 멈추기
  };

  // 가이드 모달 닫기
  const closeGuide = () => {
    setIsGuideOpen(false);
    resumeTimer(); // 가이드 모달이 닫히면 타이머 재개
  };

  // 게임이 시작되지 않았을 때 카운트다운 화면을 렌더링
  if (!gameStarted) {
    return (
      <div className="countdown-screen">
        {countdown > 0 ? countdown : '시작!'}
      </div>
    );
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
    <div className="game4-page">
      <PortraitModeWarning />

      <section className="top-nav">
        <button onClick={handleBackButtonClick} className="top-nav__back-space">
          <img src="/icons/arrow_back.svg" alt="뒤로가기" />
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">
          <div
            className="top-nav__guide-button"
            onClick={openGuide}  // 가이드 열 때 타이머 멈추기
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "absolute",
              fontSize: "20px",
              width: "20px",
              height: "20px",
              right: "10px",
            }}>
            <FaQuestionCircle style={{ width: "100%", height: "100%", zIndex: "9999" }} />
          </div>
          {round + 1} / {totalRounds}
        </div>
      </section>

      <section className="main-content">
        <div className="book-container">
          <div className="book-container__img-wrap">
            <img className="book-container__img-wrap--img" src={imageUrl} alt="error" />
          </div>
          <div className="book-container__story-wrap">
            {/* 문장을 빈칸으로 나누어 표현 */}
            <div className="book-container__story-wrap--text">
              {sentence
                .split('')
                .map((char, index) => (char === '□' ? <span key={index} className="blank"></span> : char))}
            </div>
          </div>
        </div>
        <div className="card-container">
          {/* options 배열을 순회하며 단어들을 렌더링, 클릭 시 handleOptionClick 호출 */}
          {options.map((option, index) => (
            <div
              key={index}
              className="card-container--card-wrap"
              onClick={() => handleOptionClick(option)} // 클릭 시 정답 확인 함수 호출
            >
              {option}
            </div>
          ))}
        </div>
      </section>

      <GameModal
        isOpen={isModalOpen}
        message={modalMessage}
        isCorrect={isCorrect} // 정답 여부 전달
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

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        message="게임을 그만두시겠습니까?"
        onConfirm={handleConfirmBack}
        onCancel={handleCancelBack}
      />

      <GameGuide isOpen={isGuideOpen} onRequestClose={closeGuide} />
    </div>
  );
};

export default Game4Page;
