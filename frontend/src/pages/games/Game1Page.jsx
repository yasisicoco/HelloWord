import 'regenerator-runtime/runtime';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaQuestionCircle } from 'react-icons/fa';

// API import
import { fetchGame1, fetchGameResult } from '../../api/GameAPI';
import PortraitModeWarning from '../../features/Games/portraitModeWarning';

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import useTimer from '../../hooks/useTimer';
import ResultModal from '../../components/ResultModal';
import GameGuide from '../../components/Game1Guide';

import { IoPlayCircleOutline } from "react-icons/io5";

// style
import './Game1Page.sass';
import ConfirmationModal from '../../components/ConfirmationModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false); // 결과 및 정답 모달
  const [isGuideOpen, setIsGuideOpen] = useState(true); // 가이드 모달
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // 결과 모달
  const [modalMessage, setModalMessage] = useState('');
  const [roundFinished, setRoundFinished] = useState(false); // 라운드 완료 여부 상태 추가
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false); // 오디오 재생 상태 추가
  const kidId = useSelector((state) => state.kid.selectedKidId); // 선택된 아이 ID 확인
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부 상태 추가
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // 뒤로가기 확인 모달 상태 추가

  // 카운트다운 상태 관리
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  // 뒤로가기 버튼 클릭 시 모달을 열도록 처리
  const handleBackButtonClick = () => {
    setIsConfirmationOpen(true); // 모달 열기
  };

  // 모달에서 "예"를 눌렀을 때 실행할 핸들러
  const handleConfirmBack = () => {
    setIsConfirmationOpen(false); // 모달 닫기
    nav(-1); // 뒤로 이동
  };

  // 모달에서 "아니오"를 눌렀을 때 실행할 핸들러
  const handleCancelBack = () => {
    setIsConfirmationOpen(false); // 모달 닫기
  };

  // 시간 초과 시 라운드 넘기기
  const onTimeUp = () => {
    if (!roundFinished) {
      showModal('시간이 초과되었습니다. 틀렸습니다 😞', false); // 정답 여부를 false로 명시
    }
  };

  // 타이머 관련 hook 사용
  const { timeLeft, resetTimer, pauseTimer, resumeTimer } = useTimer(10, onTimeUp); // pauseTimer, resumeTimer 추가

  // 모달을 띄운 후 일정 시간 대기 후 다음 문제로 넘어가도록 수정된 showModal 함수
  const showModal = (message, isCorrect) => {
    if (roundFinished) return; // 이미 라운드가 끝난 경우 함수 종료

    setIsModalOpen(true);
    setModalMessage(message);
    pauseTimer(); // 모달이 열리면 타이머 일시정지
    setIsCorrect(isCorrect); // 정답 여부 상태 저장
    setRoundFinished(true); // 라운드가 끝났음을 기록

    // 1초 후 모달을 닫고 다음 라운드로 이동
    setTimeout(() => {
      setIsModalOpen(false);
      handleNextRound(isCorrect); // 모달이 닫힌 후에만 다음 라운드로 이동
      setRoundFinished(false); // 다음 라운드가 시작되면 다시 라운드 상태를 false로 변경
    }, 1000); // 1초 후 모달 닫기
  };

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
      if (!accessToken) return;
      setIsDataLoading(true);
      try {
        const data = await fetchGame1(accessToken, kidId);
        setData(data.rounds); // 전체 데이터를 저장
        setTotalRounds(data.rounds.length); // 총 라운드 수 설정
        setVoice(data.rounds[0].correctWord.voiceUrl); // 첫 번째 라운드의 목소리 URL 저장
        setIsGuideOpen(data.needsTutorial);

        if (data.rounds && data.rounds.length > 0) {
          updateRoundData(data.rounds[0]); // 첫 번째 라운드 데이터 설정
        }
      } catch (err) {
        showModal('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchGameData();
  }, [accessToken, kidId]);

  // 가이드 모달이 닫힌 후 카운트다운을 시작하는 useEffect 추가
  useEffect(() => {
    if (countdown > 0) {
      pauseTimer(); // 카운트다운 동안 타이머 멈추기
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
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
      resetTimer(); // 타이머 리셋
      resumeTimer(); // 타이머 재개
    }
  }, [round, data]);

  // 모달 상태에 따라 타이머 일시정지/재개 처리
  useEffect(() => {
    if (isConfirmationOpen) {
      pauseTimer(); // 모달이 열리면 타이머 멈춤
    } else {
      resumeTimer(); // 모달이 닫히면 타이머 재개
    }
  }, [isConfirmationOpen]);

  // 카운트다운 시작 (타이머는 카운트다운 동안 멈추고, 끝난 후 시작)
  useEffect(() => {
    if (countdown > -1) {
      pauseTimer(); // 카운트다운 동안 타이머 멈추기
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000); // 1초마다 카운트다운 감소

      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
      resumeTimer(); // 카운트다운이 끝나면 타이머 시작
    }
  }, [countdown]);

  useEffect(() => {
    if (isGuideOpen) {
      pauseTimer(); // 가이드 모달이 열리면 타이머 멈추기
    } else if (!gameStarted) {
      resumeTimer(); // 가이드 모달이 닫히면 타이머 재개
    }
  }, [isGuideOpen, gameStarted, pauseTimer, resumeTimer]);

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

    // 다음 라운드로 이동하거나 결과 모달 표시
    if (round === totalRounds - 1) {
      setIsResultModalOpen(true); // 마지막 라운드에서 결과 모달 열기
      pauseTimer(); // 타이머 정지
    } else {
      setRound((prevRound) => prevRound + 1); // 다음 라운드로 이동
      resetTimer(); // 타이머 리셋 (새 라운드 시작)
      resumeTimer(); // 타이머 재개
    }
  };

  // 단어 클릭 시 정답 확인 함수
  const handleOptionClick = (selectedOption) => {
    const isCorrect = selectedOption === correct; // 정답 여부를 확인
    showModal(isCorrect ? '맞았습니다! 😊' : '틀렸습니다. 😞', isCorrect); // 정답 여부에 따라 모달 메시지 출력
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

  // 오디오 재생 함수 (재생 중에는 다시 눌러도 동작하지 않도록 설정)
  const playVoice = () => {
    if (!isPlaying && voice) {  // 재생 중이 아닐 때만 동작
      setIsPlaying(true); // 재생 시작 상태로 변경
      const audio = new Audio(voice); // voice URL을 사용하여 오디오 객체 생성
      audio.play(); // 오디오 재생

      // 오디오가 끝났을 때 재생 상태를 false로 변경
      audio.onended = () => {
        setIsPlaying(false); 
      };
    } else if (!voice) {
      showModal('재생할 음성이 없습니다.');
    }
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
    <div className="game1-page">
      <PortraitModeWarning />

      <section className="top-nav">
        {/* 뒤로가기 버튼 클릭 시 ConfirmationModal 열기 */}
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

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        message="게임을 그만두시겠습니까?"
        onConfirm={handleConfirmBack}
        onCancel={handleCancelBack}
      />

      <section className="main-content">
        <div className="main-content__img-wrap">
          <img src={imageUrl} alt="캐릭터 이미지" className="main-content__img-wrap--img" />
          <IoPlayCircleOutline className='play-icon' onClick={playVoice} />
        </div>
        <div className="main-content__card-container">
          {options.map((option, index) => (
            <div
              key={index}
              className="main-content__card-container--card-wrap"
              onClick={() => handleOptionClick(option)}>
              {option}
            </div>
          ))}
        </div>
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

      <GameGuide isOpen={isGuideOpen} onRequestClose={closeGuide} />
    </div>
  );
};

export default Game1Page;
