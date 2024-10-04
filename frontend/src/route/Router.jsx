import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute'; // ProtectedRoute 컴포넌트 임포트
import { useSelector } from 'react-redux';

// 페이지 라우팅 주소
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import UserPage from '../pages/UserPage';
import Collection from '../pages/Collection';
import Settings from '../pages/Settings';
import PasswordPage from '../pages/PasswordPage';
import Game1Page from '../pages/games/Game1Page';
import Game2Page from '../pages/games/Game2Page';
import Game3Page from '../pages/games/Game3Page';
import Game4Page from '../pages/games/Game4Page';
import SelectKidsPage from '../pages/SelectKidsPage';
import StoryPage from '../pages/StoryPage';

function Router() {
  const [hasToken, setHasToken] = useState(true);
  const check = useSelector((state) => state.auth.accessToken);

  // 토큰을 확인하는 로직 추가 (로컬 스토리지, 쿠키 등)
  useEffect(() => {
    // 아래 토큰 바꿔야함 제대로 오는지 아닌지 토큰 만들어지면 다시 구현해볼것
    if (check) {
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, [check]);

  // 보호된 경로 배열
  const protectedRoutes = [
    // 아래로 쭈욱 추가
    { path: '/home', element: <HomePage /> },
    { path: '/selectkids', element: <SelectKidsPage /> },
    { path: '/storypage', element: <StoryPage /> },

    // 인증 안되어있어서 주석처리
    // { path: '/game1', element: <Game1Page /> },
    // { path: '/game2', element: <Game2Page /> },
    // { path: '/game3', element: <Game3Page /> },
    // { path: '/game4', element: <Game4Page /> },
    // { path: '/home', element: <HomePage /> },
    // {path: '/home/userpage', element: <UserPage /> },
    // {path: '/home/collection', element: <Collection /> },
    // {path: '/homt/settings', element: <Settings /> }
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
      <Route path="/home/userpage" element={<UserPage />} />
      <Route path="/home/collection" element={<Collection />} />
      <Route path="/home/settings" element={<Settings />} />

      {/* 보호된 경로는 한 번에 처리 */}
      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<ProtectedRoute hasToken={hasToken}>{element}</ProtectedRoute>} />
      ))}
    </Routes>
  );
}

export default Router;
