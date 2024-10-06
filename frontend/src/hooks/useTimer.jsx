import { useState, useEffect } from 'react';

const useTimer = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0.1) {
          clearInterval(timer);
          onTimeUp();
          return initialTime;
        }
        return prevTime - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [initialTime, onTimeUp]);

  const resetTimer = () => setTimeLeft(initialTime);

  return { timeLeft, resetTimer };
};

export default useTimer;
