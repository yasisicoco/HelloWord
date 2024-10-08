import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false); // 타이머 일시정지 상태
  const timerRef = useRef(null); // 타이머를 참조하기 위한 ref

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0.1) {
            clearInterval(timerRef.current);
            onTimeUp();
            return initialTime;
          }
          return prevTime - 0.1;
        });
      }, 100);
    }

    return () => clearInterval(timerRef.current);
  }, [initialTime, onTimeUp, isPaused]);

  const resetTimer = () => setTimeLeft(initialTime);

  const pauseTimer = () => setIsPaused(true); // 타이머 일시정지 함수
  const resumeTimer = () => setIsPaused(false); // 타이머 재개 함수

  return { timeLeft, resetTimer, pauseTimer, resumeTimer };
};

export default useTimer;
