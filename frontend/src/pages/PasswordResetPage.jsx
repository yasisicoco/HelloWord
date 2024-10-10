import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordResetPage.sass';

import LandscapeModeWarning from '../features/Games/landscapeModeWarning';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [buttonBottom, setButtonBottom] = useState(0); // 버튼 위치를 위한 상태 추가
  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();

    // 화면 리사이즈 이벤트 처리 (키패드가 열렸을 때와 닫혔을 때 버튼 위치 조정)
    const resizeHandler = () => {
      if (visualViewport) {
        const viewportHeight = visualViewport.height;
        const windowHeight = window.innerHeight;

        if (viewportHeight < windowHeight) {
          // 키패드가 열렸을 때 스크롤 막기
          document.body.style.overflow = 'hidden';
          setButtonBottom(windowHeight - viewportHeight);
        } else {
          // 키패드가 닫혔을 때 스크롤 허용
          document.body.style.overflow = 'auto';
          setButtonBottom(0);
        }
      }
    };

    if (visualViewport) {
      visualViewport.addEventListener('resize', resizeHandler);
    }

    // 컴포넌트가 unmount될 때 overflow 설정 복원
    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', resizeHandler);
      }
      document.body.style.overflow = 'auto'; // 스크롤 복원
    };
  }, []);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(emailPattern.test(emailValue));
  };

  const handleBack = () => {
    navigate('/login');
  };

  const handlePasswordReset = () => {
    if (isEmailValid) {
      console.log('비밀번호 재설정 링크가 전송되었습니다.');
    } else {
      console.log('올바른 이메일 주소를 입력하세요.');
    }
  };

  return (
    <div className="password-reset-container">
      <LandscapeModeWarning />
      <div className="password-reset-header">
        <button className="password-reset-back-button" onClick={handleBack}>
          <span className="password-reset-back-icon">&lt;</span>
        </button>
        <h1 className="password-reset-header-title">비밀번호 찾기</h1>
      </div>

      <div className="password-reset-progress-bar">
        <div className="password-reset-progress" style={{ width: `100%` }}></div>
      </div>

      <div className="password-reset-content">
        <div className="password-reset-input-container">
          <label htmlFor="email">
            회원가입 시 등록한
            <br />
            <br />
            이메일 주소를 입력해 주세요.
          </label>
          <input
            id="email"
            type="email"
            value={email}
            ref={emailRef}
            onChange={handleEmailChange}
            placeholder="이메일 입력"
            className={!isEmailValid ? 'password-reset-error' : ''}
          />
          {!isEmailValid && <small className="password-reset-error-message">올바른 이메일을 입력하세요.</small>}
        </div>
      </div>

      <button
        className="password-reset-button"
        style={{ bottom: `${buttonBottom}px`, backgroundColor: isEmailValid && email ? '#007bff' : '#ccc' }}
        onClick={handlePasswordReset}
        disabled={!isEmailValid || !email}>
        비밀번호 재설정
      </button>

      {/* <div className="password-reset-find-id">
                <a href="/find-id">아이디 찾기 &gt;</a>
            </div> */}
    </div>
  );
};

export default PasswordResetPage;
