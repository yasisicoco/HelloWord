import React, { useState, useEffect } from 'react';
import './TimeBar.sass';

const TimeBar = ({ time }) => {
  const [maxTime, setMaxTime] = useState(time <= 10 ? 10 : 20);

  useEffect(() => {
    // 최초 렌더링 시에만 maxTime 설정 time바뀔때마다 width가 바뀌어서 설정
    setMaxTime(time <= 10 ? 10 : 20);
  }, []); // 빈 배열로 설정해서 컴포넌트 마운트 시 한 번만 실행되도록 함

  const progress = Math.max(0, Math.min(100, (time / maxTime) * 100));

  return (
    <div className="timebar-compo">
      <div className="timebar-compo__progress" style={{ width: `${progress}%` }}></div>
      <div className="timebar-compo__sec">{Math.ceil(time)} 초 남았어요</div>
    </div>
  );
};

export default TimeBar;
