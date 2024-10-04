import { Navigate } from 'react-router-dom';

function ProtectedRoute({ hasToken, children }) {
  if (!hasToken) {
    // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    alert('토큰이 만료되었습니다.');
    return <Navigate to="/login" />;
  }

  // 로그인된 경우에는 원래 컴포넌트를 렌더링
  return children;
}

export default ProtectedRoute;
