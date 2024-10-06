import React, { useState } from 'react';
import './Signup.sass';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    alert('회원가입이 완료되었습니다!');
    console.log({ email, name, phone, password });
  };

  return (
    <div className="signup-page">
      {/* 상단 바와 뒤로가기 버튼 */}
      <div className="top-bar">
        <button className="back-button" onClick={prevStep} disabled={step === 1}>
          &lt; 뒤로가기
        </button>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 각 스텝의 폼 */}
      <div className="step-content">
        {step === 1 && (
          <>
            <h2>이메일 입력</h2>
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2>이름 입력</h2>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        {step === 3 && (
          <>
            <h2>휴대전화번호 입력</h2>
            <input
              type="tel"
              placeholder="휴대전화번호 입력"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        )}

        {step === 4 && (
          <>
            <h2>비밀번호 입력</h2>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
      </div>

      {/* 하단 "다음" 버튼 */}
      <div className="next-button-container">
        {step < 4 ? (
          <button onClick={nextStep} disabled={!email && step === 1}>
            다음
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={!password}>
            완료
          </button>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
