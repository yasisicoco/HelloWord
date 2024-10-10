import React, { useState, useEffect } from 'react';
import './portraitModeWarning.sass';

const PortraitModeWarning = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsPortrait(height > width);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <>
      <img className="rotation-img" src="/character/rotatephone.png" alt="회전" />
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
