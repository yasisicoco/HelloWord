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
    // 세로 방향 고정
    const portraitPages = ['/', '/login', '/select-kid', '/signup', '/find/password', '/find/id', '/add-profile'];
    // 가로 방향 고정
    const landscapePages = [
      '/home',
      '/storypage',
      '/game1',
      '/game2',
      '/game3',
      '/game4',
      '/userpage',
      '/collection',
      '/settings',
    ];

    const preventRotation = () => {
      // 페이지별로 화면 방향 고정
      if (portraitPages.includes(location.pathname)) {
        lockOrientation('portrait');
      } else if (landscapePages.includes(location.pathname)) {
        lockOrientation('landscape');
      }
    };

    preventRotation();

    const handleOrientationChange = () => {
      preventRotation();
    };

    window.screen.orientation?.addEventListener('change', handleOrientationChange);

    return () => {
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
