import React, { useState, useEffect } from 'react';
import './portraitModeWarning.sass';
import rotatephone from '../../assets/character/rotatephone.png';

const PortraitModeWarning = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen && window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        // 폴백: 윈도우 크기로 확인
        setIsPortrait(window.innerHeight > window.innerWidth);
      }
    };

    // 초기 방향 확인
    checkOrientation();

    // Screen Orientation API 이벤트 리스너
    const handleOrientationChange = () => {
      checkOrientation();
    };

    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    } else {
      // 폴백: resize 이벤트 사용
      window.addEventListener('resize', checkOrientation);
    }

    // 클린업 함수
    return () => {
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      } else {
        window.removeEventListener('resize', checkOrientation);
      }
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <>
      <img className="rotation-img" src={rotatephone} alt="회전" />
      <div className="modal-background" onClick={(e) => e.stopPropagation()} />
      <div className="rotation-warning">
        가로 모드로
        <br />
        변경해 주세요!
      </div>
    </>
  );
};

export default PortraitModeWarning;
