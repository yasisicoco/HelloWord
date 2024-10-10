import './styles/reset.css';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PWARouter from './route/PWARouter';
import useIsPWA from './hooks/useIsPWA';
import BrowserRouter from './route/BrowserRouter';

function App() {
  const isPWA = useIsPWA();

  return (
    <div className="App">
      {isPWA ? <PWARouter /> : <BrowserRouter />}
      <PWARouter />
    </div>
  );
}

export default App;
