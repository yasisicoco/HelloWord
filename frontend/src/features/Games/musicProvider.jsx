import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [audio] = useState(new Audio('/sounds/energetic-bgm.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('음악 재생 오류:', error);
        });
    }
  };

  useEffect(() => {
    audio.loop = true;

    return () => {
      audio.pause();
      setIsPlaying(false);
    };
  }, [audio]);

  // 페이지 변경 감지 및 음악 중지
  useEffect(() => {
    audio.pause();
    setIsPlaying(false);
  }, [location, audio]);

  return <MusicContext.Provider value={{ isPlaying, togglePlay }}>{children}</MusicContext.Provider>;
};
