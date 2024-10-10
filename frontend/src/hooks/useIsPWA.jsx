import { useState, useEffect } from 'react';

function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      setIsPWA(isStandalone);
    };

    checkPWA();

    window.addEventListener('resize', checkPWA); // 사용자가 화면 크기를 바꿀 때도 상태를 업데이트

    return () => window.removeEventListener('resize', checkPWA);
  }, []);

  return isPWA;
}

export default useIsPWA;
