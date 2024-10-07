import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const check = useSelector((state) => state.auth.accessToken);

  if (!check) {
    // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    alert('다시 로그인 해주세요.');
    return <Navigate to="/login" />;
  }

  // 로그인된 경우에는 원래 컴포넌트를 렌더링
  return children;
}

export default ProtectedRoute;
