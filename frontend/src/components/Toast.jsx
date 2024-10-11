import React, { useEffect } from 'react';
import './Toast.sass';

const Toast = ({ message, closeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast();
    }, 3000); // 3초 뒤에 자동으로 사라짐

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 제거
  }, [closeToast]);

  return (
    <div className="toast">
      <p>{message}</p>
    </div>
  );
};

export default Toast;
