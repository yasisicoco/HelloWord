import './styles/reset.css';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Router from './route/Router';

function App() {
  const location = useLocation();

  useEffect(() => {
    const lockOrientation = (orientation) => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientation).catch((err) => {
          console.warn('Orientation lock failed:', err);
        });
      }
    };

    const preventRotation = () => {
      // 화면이 회전하지 않도록 고정
      if (
      
        location.pathname === '/select-kid' ||
        location.pathname === '/signup' ||
        location.pathname === '/find/password' ||
        location.pathname === '/find/id' ||
        location.pathname === '/add-profile'
      ) {
        lockOrientation('portrait'); // 세로 고정
      } else if (
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/home' ||
        location.pathname === '/storypage' ||
        location.pathname === '/game1' ||
        location.pathname === '/game2' ||
        location.pathname === '/game3' ||
        location.pathname === '/game4' ||
        location.pathname === '/userpage' ||
        location.pathname === '/collection' ||
        location.pathname === '/settings'
      ) {
        lockOrientation('landscape'); // 가로 고정
      }
    };

    // 페이지 로드 시 방향 고정
    preventRotation();

    // 화면 회전 방지 (onchange 리스너 등록)
    const handleOrientationChange = () => {
      preventRotation();
    };

    window.screen.orientation?.addEventListener('change', handleOrientationChange);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.screen.orientation?.removeEventListener('change', handleOrientationChange);
    };
  }, [location]);

  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
