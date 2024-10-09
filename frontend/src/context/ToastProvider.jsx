import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

// ToastContext 생성
const ToastContext = createContext();

// ToastProvider 컴포넌트 정의
export const ToastProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState('');

  // 토스트를 트리거하는 함수
  const triggerToast = (message) => {
    setToastMessage(message);
  };

  // context 값으로 triggerToast를 제공
  return (
    <ToastContext.Provider value={{ triggerToast }}>
      {children}
      {/* 토스트 메시지가 존재할 때만 Toast 컴포넌트 렌더링 */}
      {toastMessage && (
        <Toast message={toastMessage} closeToast={() => setToastMessage('')} />
      )}
    </ToastContext.Provider>
  );
};

// Context를 사용하여 Toast를 트리거하는 함수 반환
export const useToast = () => useContext(ToastContext);
