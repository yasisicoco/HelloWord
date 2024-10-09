import { useState, useRef } from 'react';
import './Login.sass';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import UserAPI from '../api/UserAPI';
import { setTokens } from '../features/Auth/authSlice';
import xIcon from '../assets/homeIcon/x-icon.png';
import { useToast } from '../context/ToastProvider';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { triggerToast } = useToast();  // useToast 훅 사용

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      triggerToast('올바른 이메일 주소를 입력해 주세요.');  // 전역 토스트 호출
      return;
    }

    try {
      const response = await UserAPI().login(email, password);

      if (response.status === 200) {
        const refreshToken = response.data.refreshToken;
        const accessToken = response.data.accessToken;

        dispatch(setTokens({ accessToken, refreshToken }));
        navigate('/select-kid');
      } else {
        triggerToast('입력하신 정보가 틀렸습니다.');  // 전역 토스트 호출
      }
    } catch (error) {
      console.error('로그인 중 에러 발생:', error);
      triggerToast('입력하신 정보가 틀렸습니다.');  // 전역 토스트 호출
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

  const handleClearInput = (setter) => {
    setter('');
  };

  return (
    <div className="login-Page">
      <section className="login-Logo">
        <img className="login-Logo__img" src="/gamethumbnail/favicon.png" alt="Logo" />
      </section>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-input">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEmailKeyPress}
            />
            {email && <img className="clear-icon" src={xIcon} onClick={() => handleClearInput(setEmail)} />}
          </div>
        </div>
        <div className="login-input">
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              ref={passwordInputRef}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handlePasswordKeyPress}
            />
          </div>
        </div>
        <button type="submit" className="login-button" disabled={!isFormValid}>
          <img src='/character/guiyomi.png' alt="로그인 이미지" />
          로그인
        </button>
      </form>

      <div className="link-box">
        <Link to="/find/id" className="link-item">아이디 찾기</Link>
        <span className="divider">|</span>
        <Link to="/find/password" className="link-item">비밀번호 찾기</Link>
        <span className="divider">|</span>
        <Link to="/signup" className="link-item">회원가입</Link>
      </div>
    </div>
  );
};

export default LoginPage;
