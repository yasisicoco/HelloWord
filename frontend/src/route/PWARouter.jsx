import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // ProtectedRoute 컴포넌트 임포트

// 페이지 라우팅 주소
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import UserPage from '../pages/UserPage';
import Collection from '../pages/Collection';
import Settings from '../pages/Settings';
import Game1Page from '../pages/games/Game1Page';
import Game2Page from '../pages/games/Game2Page';
import Game3Page from '../pages/games/Game3Page';
import Game4Page from '../pages/games/Game4Page';
import StoryPage from '../pages/StoryPage';
import PasswordResetPage from '../pages/PasswordResetPage'
import ProfileSelectionPage from '../pages/ProfileSelectionPage'
import AddProfilePage from '../pages/AddProfilePage'

function PWARouter() {
  // 보호된 경로 배열
  const protectedRoutes = [
    // 아래로 쭈욱 추가
    { path: '/home', element: <HomePage /> },
    { path: '/select-kid', element: <ProfileSelectionPage /> },
    { path: '/storypage', element: <StoryPage /> },
    { path: '/game1', element: <Game1Page /> },
    { path: '/game2', element: <Game2Page /> },
    { path: '/game3', element: <Game3Page /> },
    { path: '/game4', element: <Game4Page /> },
    { path: '/profile', element: <UserPage /> },
    { path: '/collection', element: <Collection /> },
    { path: '/settings', element: <Settings /> },
    { path: "/add-profile", element: <AddProfilePage /> }
  ];

  return (
    <Routes>
      {/* 비보호 경로 */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/find/password" element={<PasswordResetPage />} />
      <Route path="/find/id" element={<PasswordResetPage />} />

      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
      ))}

      {/* 잘못된 경로 처리 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default PWARouter;
