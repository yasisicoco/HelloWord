import React, { useState, useEffect, useCallback } from 'react';
import './landscapeModeWarning.sass';
// import rotatephoneVertical from '../../assets/character/rotatephoneVertical.png';

const LandscapeModeWarning = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  const handleResize = useCallback(() => {
    if (window.screen && window.screen.orientation) {
      // Use Screen Orientation API if available
      setIsLandscape(window.screen.orientation.type.includes('landscape'));
    } else {
      // Fallback to comparing window dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsLandscape(width > height);
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

  if (!isLandscape) return null;

  return (
    <>
      {/* <img className="rotation-img" src={rotatephoneVertical} alt="세로로 회전" /> */}
      <div className="modal-background" onClick={(e) => e.stopPropagation()} />
      <div className="rotation-warning">
        세로 모드로
        <br />
        변경해 주세요!
      </div>
    </>
  );
};

export default LandscapeModeWarning;
