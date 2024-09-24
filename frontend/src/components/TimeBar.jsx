import React, { useState, useEffect } from 'react';
import './TimeBar.sass';

const TimeBar = ({ time }) => {
  const [sec, setSec] = useState(time);

  useEffect(() => {
    setSec(time);

    const interval = 100; // 0.1초 간격

    const interval_id = setInterval(() => {
      setSec((prevSec) => {
        if (prevSec <= 0) {
          clearInterval(interval_id);
          return 0;
        }
        return prevSec - 0.1; // 0.1초씩 감소
      });
    }, interval);

    return () => clearInterval(interval_id);
  }, [time]);

  const progress = Math.max(0, Math.min(100, (sec / time) * 100));

  return (
    <div className="timebar-compo">
      <div className="timebar-compo__progress" style={{ width: `${progress}%` }}></div>
      <div className="timebar-compo__sec">{Math.ceil(sec)} 초 남았어요</div>
    </div>
  );
};

export default TimeBar;
