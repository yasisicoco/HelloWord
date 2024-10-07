// hook
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// API import
import { fetchGame4 } from '../../api/GameAPI';
import { fetchGameResult } from '../../api/GameAPI'; // API 불러오기

// compo
import TimeBar from '../../components/TimeBar';
import GameModal from '../../components/GameModal';
import useTimer from '../../hooks/useTimer';

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
  const [modalMessage, setModalMessage] = useState('');
  const [roundFinished, setRoundFinished] = useState(false); // 라운드 완료 여부 상태 추가
  const [isDataLoading, setIsDataLoading] = useState(true);
  const kidId = useSelector((state) => state.kid.selectedKidId); // 선택된 아이 ID 확인
  const accessToken = useSelector((state) => state.auth.accessToken);

  // 시간 초과 시 라운드 넘기기
  const onTimeUp = () => {
    showModal('시간이 초과되었습니다. 틀렸습니다 😞');
    handleNextRound(false); // 타임아웃 시 틀린 것으로 처리
  };
  const { timeLeft, resetTimer } = useTimer(10, onTimeUp); // startTimer 추가

  const showModal = (message) => {
    setIsModalOpen(true);
    setModalMessage(message);
    setTimeout(() => setIsModalOpen(false), 1000);
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
    console.log('###################');
    console.log(currentRoundData);
    setCorrect(correctWord);
    setImage(currentRoundData.imageUrl);
    setSentence(currentRoundData.sentence);
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
        const rounds = await fetchGame4(accessToken, kidId);
        setData(rounds); // 전체 데이터를 저장
        setTotalRounds(rounds.length); // 총 라운드 수 설정
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
        ...prevList,
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
      // 마지막 라운드이면 결과 전송
      if (round === totalRounds - 1) {
        sendGameResult(); // 마지막 라운드에서 처리 후 즉시 결과 전송
      } else {
        setRound((prevRound) => prevRound + 1); // 다음 라운드로 이동
      }
      setRoundFinished(false); // 라운드 완료 상태 초기화
    }
  }, [roundFinished, round, totalRounds]);

  // 단어 클릭 시 정답 확인 함수
  const handleOptionClick = (selectedOption) => {
    if (selectedOption === correct) {
      showModal('맞았습니다! 😊');
      handleNextRound(true); // 정답 처리 후 다음 라운드로 이동
    } else {
      showModal('틀렸습니다. 😞');
      handleNextRound(false); // 틀림 처리 후 다음 라운드로 이동
    }
  };

  // 게임 결과 전송 함수
  const sendGameResult = async () => {
    const correctRate = correctAnswer / totalRounds;
    const resultData = {
      kidId: kidId,
      answerWords: correctWordsList, // 맞춘 단어 리스트만 전송
      gameType: 'FAIRYTALE_GAME',
      playTime: totalPlayTime, // 전체 라운드에서 걸린 총 시간
      correctRate: correctRate, // 정답률 계산
      correctCount: correctAnswer,
    };

    try {
      // console.log(correctRate);
      // console.log(resultData);
      // console.log(totalPlayTime);
      // console.log(correctRate);
      // console.log(correctAnswer);
      await fetchGameResult(accessToken, resultData);
      nav('/home'); // 결과 전송 후 결과 페이지로 이동
    } catch (err) {
      showModal('결과 전송에 실패했습니다.');
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
    <div className="game4-page">
      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          뒤로가기
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar time={timeLeft} />
        </div>
        <div className="top-nav__bookmarker">페이지</div>
      </section>

      <section className="main-content">
        <div className="book-container">
          <div className="book-container__img-wrap">
            <img className="book-container__img-wrap--img" src={imageUrl} alt="error" />
          </div>
          <div className="book-container__story-wrap">
            <div className="book-container__story-wrap--text">{sentence}</div>
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

      <GameModal isOpen={isModalOpen} message={modalMessage} onRequestClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Game4Page;
