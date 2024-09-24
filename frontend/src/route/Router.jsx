import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute'; // ProtectedRoute 컴포넌트 임포트

import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import Game1Page from '../pages/games/Game1Page';

function Router() {
  const [hasToken, setHasToken] = useState(true);

  // 토큰을 확인하는 로직 추가 (로컬 스토리지, 쿠키 등)
  useEffect(() => {
    const token = localStorage.getItem('token'); // 예시: 로컬 스토리지에서 토큰 확인
    if (token) {
      setHasToken(true);
    }
  }, []);

  return (
    <Routes>
      {/* 로그인 페이지는 보호되지 않음 */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/game1" element={<Game1Page />} />

      {/* 임시 */}
      {/* <Route path="/home" element={<HomePage />} /> */}

      {/* Home 경로는 로그인된 사용자만 접근 가능 */}
      <Route
        path="/home"
        element={
          <ProtectedRoute hasToken={hasToken}>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
