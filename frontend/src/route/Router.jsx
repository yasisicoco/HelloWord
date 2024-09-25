import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute'; // ProtectedRoute 컴포넌트 임포트

// 페이지 라우팅 주소
import LoginPage from '../pages/LoginPage';

function Router() {
  const [hasToken, setHasToken] = useState(false);
  const token = useAuth(); // 예시: 로컬 스토리지에서 토큰 확인

  // 토큰을 확인하는 로직 추가 (로컬 스토리지, 쿠키 등)
  useEffect(() => {
    if (token) {
      console.log(token);
      setHasToken(true);
      console.log('접속완료');
    } else {
      setHasToken(false);
      console.log('접속실패');
    }
  }, []);

  // 보호된 경로 배열
  const protectedRoutes = [
    // 아래로 쭈욱 추가
    { path: '/home', element: <HomePage /> },
    // { path: '/home', element: <HomePage /> },
  ];

  return (
    <Routes>
      {/* 비보호 경로 */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Home 경로는 로그인된 사용자만 접근 가능 */}
      <Route
        path="/login"
        element={
          <ProtectedRoute hasToken={hasToken}>
            <LoginPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
