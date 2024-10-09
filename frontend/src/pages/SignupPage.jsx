import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.sass';
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
  const [authCode, setAuthCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [codeVerificationError, setCodeVerificationError] = useState('');
  const [isAuthCodeRequested, setIsAuthCodeRequested] = useState(false);
  const [isVerificationInProgress, setIsVerificationInProgress] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isResendAllowed, setIsResendAllowed] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const authCodeRef = useRef(null);

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

  // 타이머 시작을 위한 useEffect 추가
  useEffect(() => {
    let countdown;
    if (isAuthCodeRequested && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendAllowed(true); // 타이머가 끝나면 재발급 허용
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [isAuthCodeRequested, timer]);

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

  // 중복확인 버튼 클릭 시 이메일 중복 체크 및 인증번호 요청
  const handleEmailCheckAndRequest = async () => {
    if (!emailValid) return;

    if (!email) {
      setEmailVerificationError('이메일을 입력해 주세요.');
      return;
    }

    const isAvailable = await UserAPI().checkEmailAvailability(email);
    if (isAvailable) {
      setEmailChecked(true);
      setEmailVerificationError('');
      await handleEmailVerification();
    } else {
      setEmailChecked(false);
      setEmailVerificationError('이미 사용 중인 이메일입니다.');
    }
  };

  // 이메일 인증번호 요청 함수
  const handleEmailVerification = async () => {
    setIsVerificationInProgress(true);

    try {
      setIsAuthCodeRequested(true);
      setTimer(180);
      const generatedCode = await UserAPI().requestEmailVerification(email);
      if (generatedCode) {
        setEmailVerificationError('');
        setIsResendAllowed(false);
      }
    } catch (error) {
      setEmailVerificationError('인증 요청에 실패했습니다.');
    } finally {
      setIsVerificationInProgress(false);
    }
  };

  // 인증번호 확인 함수
  const handleAuthCodeCheck = async () => {
    if (!authCode) {
      setCodeVerificationError('인증번호를 입력하세요.');
      setIsVerificationInProgress(false);
      return;
    }

    try {
      await UserAPI().checkEmailVerification(email, authCode);
      setIsEmailVerified(true);
      setCodeVerificationError('');
      setIsAuthCodeRequested(false);
    } catch (error) {
      setCodeVerificationError(error.response.data.reason);
      setIsVerificationInProgress(true);
    } finally {
      setIsVerificationInProgress(false);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailPattern = /^(?=.*[a-zA-Z])(?=.*[~!@#$%^*+=-])(?=.*[0-9]).{8,30}$/;
    setEmailVerificationError(emailPattern.test(emailValue) ? '' : '올바른 이메일을 입력하세요.');
    setEmailChecked(false);
    setIsEmailVerified(false);
    setIsAuthCodeRequested(false);
    setCodeVerificationError('');
    setIsResendAllowed(false)
    setIsVerificationInProgress(false);
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

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~@$!%*?&^+-=])[A-Za-z\d@$!%*?&]{8,}$/;
    setIsPasswordValid(passwordRegex.test(passwordValue));
  };

  const isPasswordMismatch = password && confirmPassword && password !== confirmPassword;

  const isNextButtonDisabled = () => {
    if (step === 1 && (!email || !emailChecked || !isEmailVerified)) return true;
    if (step === 2 && !username) return true;
    if (step === 3 && phone.length !== 13) return true;
    if (step === 4 && (!password || password !== confirmPassword || !isPasswordValid)) return true;
    return false;
  };

  const handleSignUp = async () => {
    const sanitizedPhone = phone.replace(/-/g, '');

    const success = await UserAPI().signUp(email, password, username, sanitizedPhone);

    if (success) {
      navigate('/login');
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
                className={emailVerificationError ? 'error' : ''}
              />
              <button
                className="check-button"
                onClick={handleEmailCheckAndRequest}
                disabled={emailChecked || isVerificationInProgress}
              >
                인증번호 요청
              </button>
            </div>
            {emailVerificationError && (
              <small className="error-message">{emailVerificationError}</small>
            )}
            {emailChecked && (
              <div className="auth-code-section">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={authCode}
                    ref={authCodeRef}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="인증번호 입력"
                    disabled={!isAuthCodeRequested}
                    className={codeVerificationError ? 'error' : ''}
                  />
                  {isAuthCodeRequested && !isEmailVerified && (
                    <span className="input-timer">{`${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}`}</span>
                  )}
                </div>
                <button
                  className="verify-button"
                  onClick={isResendAllowed ? handleEmailVerification : handleAuthCodeCheck}
                  disabled={isVerificationInProgress || (!isResendAllowed && isEmailVerified)}
                >
                  {isResendAllowed ? '재발급 요청' : '인증확인'}
                </button>
              </div>
              
            )}
            {codeVerificationError && (
              <small className="error-message">{codeVerificationError}</small>
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
              maxLength="10"
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
              maxLength="13"
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
              onChange={handlePasswordChange}
              placeholder="비밀번호 입력"
            />
            {!isPasswordValid && (
              <small className="error-message">비밀번호는 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.</small>
            )}
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
