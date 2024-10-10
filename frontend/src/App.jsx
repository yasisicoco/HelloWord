import './styles/reset.css';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PWARouter from './route/PWARouter';
import useIsPWA from './hooks/useIsPWA';
import BrowserRouter from './route/BrowserRouter';

function App() {
  const location = useLocation();

  const isPWA = useIsPWA();

  useEffect(() => {
    const lockOrientation = (orientation) => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientation).catch((err) => {
          console.warn('Orientation lock failed:', err);
        });
      }
    };

    const requestFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
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

    // const preventRotation = () => {
    //   requestFullscreen(); // 전체 화면 활성화 시도
    //   if (portraitPages.includes(location.pathname)) {
    //     lockOrientation('portrait');
    //   } else if (landscapePages.includes(location.pathname)) {
    //     lockOrientation('landscape');
    //   }
    // };

    // preventRotation();

    // window.screen.orientation?.addEventListener('change', preventRotation);

    return () => {
      // window.screen.orientation?.removeEventListener('change', preventRotation);
    };
  }, [location]);

  return (
    <div className="App">
      {isPWA ? <PWARouter /> : <BrowserRouter />}
      {/* <PWARouter /> */}
    </div>
  );
}

export default App;
