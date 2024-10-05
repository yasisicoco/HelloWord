import React from 'react';
import './TimeBar.sass';

const TimeBar = ({ time }) => {
  const progress = Math.max(0, Math.min(100, (time / 10) * 100));

  return (
    <div className="timebar-compo">
      <div className="timebar-compo__progress" style={{ width: `${progress}%` }}></div>
      <div className="timebar-compo__sec">{Math.ceil(time)} 초 남았어요</div>
    </div>
  );
};

export default TimeBar;
