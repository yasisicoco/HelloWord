import React, { createContext, useState, useEffect } from 'react';

// MusicContext 생성
export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [audio] = useState(new Audio('/sounds/energetic-bgm.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);

  // 음악 재생 상태를 관리하는 함수
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true)) // 재생 성공 시 상태 변경
        .catch((error) => {
          console.error('음악 재생 오류:', error); // 오류 처리
        });
    }
  };

  // 컴포넌트가 마운트될 때 오디오 설정
  useEffect(() => {
    audio.loop = true; // 무한 반복 재생
    // audio.play(); // 자동 재생

    // 컴포넌트 언마운트 시 음악 멈춤
    return () => {
      audio.pause();
      setIsPlaying(false); // 상태 초기화
    };
  }, [audio]);

  return <MusicContext.Provider value={{ isPlaying, togglePlay }}>{children}</MusicContext.Provider>;
};
