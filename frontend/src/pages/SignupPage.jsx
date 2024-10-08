import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.sass';
import UserAPI from '../api/UserAPI';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [buttonBottom, setButtonBottom] = useState(0);
  const [isTransition, setIsTransition] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (step === 1) emailRef.current?.focus();
    if (step === 2) usernameRef.current?.focus();
    if (step === 3) phoneRef.current?.focus();
    if (step === 4) passwordRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const resizeHandler = () => {
      if (visualViewport) {
        const viewportHeight = visualViewport.height;
        const windowHeight = window.innerHeight;

        if (viewportHeight < windowHeight) {
          setIsTransition(false);
          setButtonBottom(windowHeight - viewportHeight);
        } else {
          setIsTransition(true);
          setButtonBottom(0);
        }
      }
    };

    if (visualViewport) {
      visualViewport.addEventListener('resize', resizeHandler);
    }

    return () => {
      visualViewport && visualViewport.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      await handleSignUp();
    }
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/login');
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleEmailCheck = () => {
    if (emailValid) {
      setEmailChecked(true);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailValid(emailPattern.test(emailValue));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 3 && value.length <= 7) {
      value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    } else if (value.length > 7) {
      value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
    }
    setPhone(value);
  };

  const isPasswordMismatch = password && confirmPassword && password !== confirmPassword;

  const isNextButtonDisabled = () => {
    if (step === 1 && (!email || !emailChecked)) return true;
    if (step === 2 && !username) return true;
    if (step === 3 && !phone) return true;
    if (step === 4 && (!password || password !== confirmPassword)) return true;
    return false;
  };

  const handleSignUp = async () => {
    console.log('회원가입 함수 호출');

    const sanitizedPhone = phone.replace(/-/g, '');

    const success = await UserAPI().signUp(email, password, username, sanitizedPhone);

    if (success) {
      console.log('회원가입 성공');
      navigate('/login');
    } else {
      console.log('회원가입 실패');
    }
  };


  return (
    <div className="signup-container">
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-icon">&lt;</span>
        </button>
        <h1 className="header-title">회원가입</h1>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
      </div>

      <div className="step-content">
        {step === 1 && (
          <div className="input-container">
            <label htmlFor="email">이메일을 입력해 주세요.</label>
            <div className="input-with-button">
              <input
                id="email"
                type="email"
                value={email}
                ref={emailRef}
                onChange={handleEmailChange}
                placeholder="이메일 입력"
                className={!emailValid ? 'error' : ''}
              />
              <button
                className="check-button"
                onClick={handleEmailCheck}
                disabled={!emailValid}
              >
                {emailChecked ? '✔' : '확인'}
              </button>
            </div>
            {!emailValid && (
              <small className="error-message">올바른 이메일을 입력하세요.</small>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="input-container">
            <label htmlFor="username">이름을 입력해 주세요.</label>
            <input
              id="username"
              type="text"
              value={username}
              ref={usernameRef}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="이름 입력"
            />
          </div>
        )}
        {step === 3 && (
          <div className="input-container">
            <label htmlFor="phone">전화번호를 입력해 주세요.</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              ref={phoneRef}
              onChange={handlePhoneChange}
              placeholder="전화번호 입력"
            />
          </div>
        )}
        {step === 4 && (
          <div className="input-container">
            <label htmlFor="password">비밀번호를 입력해 주세요.</label>
            <input
              id="password"
              type="password"
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
            />
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인 입력"
              className={isPasswordMismatch ? 'error' : ''}
            />
            {isPasswordMismatch && (
              <small className="error-message">비밀번호가 일치하지 않습니다.</small>
            )}
          </div>
        )}
      </div>

      <button
        className={`next-button ${isTransition ? 'with-transition' : ''}`}
        style={{ bottom: `${buttonBottom}px`, backgroundColor: isNextButtonDisabled() ? '#ccc' : '#007bff' }}
        onClick={handleNext}
        disabled={isNextButtonDisabled()}
      >
        {step === 4 ? '회원가입' : '다음'}
      </button>
    </div>
  );
};

export default SignUpPage;
