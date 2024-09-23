import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ hasToken, children }) {
  if (!hasToken) {
    // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    return <Navigate to="/login" />;
  }

  // 로그인된 경우에는 원래 컴포넌트를 렌더링
  return children;
}

// PropTypes를 사용하여 prop 검증 추가
ProtectedRoute.propTypes = {
  hasToken: PropTypes.bool.isRequired, // hasToken은 필수로 전달되는 boolean 타입
  children: PropTypes.node.isRequired, // children은 JSX 요소 또는 컴포넌트가 필수로 전달되어야 함
};

export default ProtectedRoute;
