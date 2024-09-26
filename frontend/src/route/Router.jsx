import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute'; // ProtectedRoute 컴포넌트 임포트

// 페이지 라우팅 주소
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import PasswordPage from '../pages/PasswordPage';
import Game1Page from '../pages/games/Game1Page';
import Game2Page from '../pages/games/Game2Page';
import Game3Page from '../pages/games/Game3Page';
import Game4Page from '../pages/games/Game4Page';
import SelectKidsPage from '../pages/SelectKidsPage';

// 토큰 여부 확인
import { useAuth } from '../features/Auth/selectors';

function Router() {
  const [hasToken, setHasToken] = useState(false);
  const token = useAuth(); // 예시: 로컬 스토리지에서 토큰 확인

  // 토큰을 확인하는 로직 추가 (로컬 스토리지, 쿠키 등)
  useEffect(() => {
    // 아래 토큰 바꿔야함 제대로 오는지 아닌지 토큰 만들어지면 다시 구현해볼것
    if (token) {
      console.log(token);
      setHasToken(true);
      console.log('접속완료');
    } else {
      setHasToken(false);
      console.log('접속실패');
    }
  }, [hasToken]);

  // 새로고침해도 다시 토큰을 먼저 확인 후 진행하므로 괜춘
  if (hasToken == false) {
    return <div>Loading...</div>;
  }

  // 보호된 경로 배열
  const protectedRoutes = [
    // 아래로 쭈욱 추가
    { path: '/home', element: <HomePage /> },
    { path: '/selectkids', element: <SelectKidsPage /> },

    // 인증 안되어있어서 주석처리
    // { path: '/game1', element: <Game1Page /> },
    // { path: '/game2', element: <Game2Page /> },
    // { path: '/game3', element: <Game3Page /> },
    // { path: '/game4', element: <Game4Page /> },
    // { path: '/home', element: <HomePage /> },
  ];

  return (
    <Routes>
      {/* 비보호 경로 */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/password" element={<PasswordPage />} />

      {/* 개발용 코드 */}
      <Route path="/game1" element={<Game1Page />} />
      <Route path="/game2" element={<Game2Page />} />
      <Route path="/game3" element={<Game3Page />} />
      <Route path="/game4" element={<Game4Page />} />
      <Route path="/home" element={<HomePage />} />

      {/* 보호된 경로는 한 번에 처리 */}
      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<ProtectedRoute hasToken={hasToken}>{element}</ProtectedRoute>} />
      ))}
    </Routes>
  );
}

export default Router;
