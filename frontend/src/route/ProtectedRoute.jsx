import { Navigate } from 'react-router-dom';

function ProtectedRoute({ hasToken, children }) {
  if (!hasToken) {
    // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    alert('로그인 다시 하라해~');
    return <Navigate to="/login" />;
  }

  // 로그인된 경우에는 원래 컴포넌트를 렌더링
  return children;
}

export default ProtectedRoute;
