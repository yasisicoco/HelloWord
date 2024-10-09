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

    const portraitPages = ['/', '/login', '/select-kid', '/signup', '/find/password', '/find/id', '/add-profile'];
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

    const currentPath = location.pathname;

    if (portraitPages.includes(currentPath)) {
      lockOrientation('portrait');
    } else if (landscapePages.includes(currentPath)) {
      lockOrientation('landscape');
    }

    // 컴포넌트가 언마운트될 때 방향 잠금 해제
    return () => {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    };
  }, [location]);

  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
