import React, { useState, useEffect, useCallback } from 'react';
import './portraitModeWarning.sass';
import rotatephone from '../../assets/character/rotatephone.png';

const PortraitModeWarning = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  const handleResize = useCallback(() => {
    if (window.screen && window.screen.orientation) {
      // Use Screen Orientation API if available
      setIsPortrait(window.screen.orientation.type.includes('portrait'));
    } else {
      // Fallback to comparing window dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsPortrait(height > width);
    }
  }, []);

  useEffect(() => {
    handleResize(); // Initial check

    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 250);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

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
