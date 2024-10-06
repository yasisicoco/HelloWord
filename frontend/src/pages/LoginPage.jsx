import { useEffect, useState, useRef } from 'react';
import './Login.sass';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import UserAPI from '../api/UserAPI';
import { setTokens } from '../features/Auth/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setErrorMessage('올바른 이메일 주소를 입력해 주세요.');
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await UserAPI().login(email, password);

      if (response.status === 200) {
        const refreshToken = response.data.refreshToken;
        const accessToken = response.data.accessToken;

        dispatch(setTokens({ accessToken, refreshToken }));
        navigate('/selectkids');
      } else {
        setErrorMessage('입력하신 정보가 틀렸습니다.');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('로그인 중 에러 발생:', error);
      setErrorMessage('입력하신 정보가 틀렸습니다.');
      setIsModalOpen(true);
    }
  };

  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter' && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (passwordInputRef.current) {
        passwordInputRef.current.blur();
      }
    }
  };

  const isFormValid = email && password;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    // 모달 외부를 클릭했을 때만 닫기
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="login-Page">
      <section className="login-Logo">
        <img className="login-Logo__img" src="/gamethumbnail/favicon.png" alt="Logo" />
      </section>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-input">
          <input
            type="text"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleEmailKeyPress}
          />
        </div>
        <div className="login-input">
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            ref={passwordInputRef}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handlePasswordKeyPress}
          />
        </div>
        <button type="submit" className="login-button" disabled={!isFormValid}>
          <img src='/character/guiyomi.png' alt="로그인 이미지" />
          로그인
        </button>
      </form>

      <div className="link-box">
        <Link to="/find" className="link-item">아이디 / 비밀번호 찾기</Link>
        <Link to="/signup" className="link-item">회원가입</Link>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1>Hello Word</h1>
            <p>{errorMessage}</p>
            <hr /> {/* 가로줄 추가 */}
            <div onClick={closeModal}>확인</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
