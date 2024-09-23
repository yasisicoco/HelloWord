import { useState } from 'react';
import Signup from '../components/Signup';

import './Signup.sass';

const SignupPage = () => {
  // 유저 정보
  const [email, SetUserEmail] = useState('');
  const [password1, SetPassword1] = useState('');
  const [password2, SetPassword2] = useState('');
  const [phone, SetPhone] = useState('');

  // 에러 여부 확인 (실시간 확인)
  const [idErr, setIdErr] = useState('');
  const [pass1Err, Setpass1] = useState('');
  const [pass2Err, Setpass2] = useState('');

  // 아이디 중복여부 확인 검사
  const [isIdCheck, SetisIdCheck] = useState(false);

  // 회원가입 정보 전달
  const handleLogin = async (event) => {
    event.preventDefault();
    // 여기다가 회원가입 정보 전달하기
  };

  // 아이디 유효성 검사 및 중복 검사 Handler
  const idCheckHandler = async (email) => {
    // 여기다가 구현하기
    return false;
  };

  const checkId = async (event) => {
    event.preventDefault();
    // 여기서 아이디 중복여부 확인하기
  };

  return (
    <section className="signup-page">
      <form onSubmit={handleLogin} className="signup-form">
        <p className="signup-form__text">이메일</p>
        <div className="signup-form__email-container">
          <input
            type="text"
            id="userId"
            autoFocus
            placeholder="이메일"
            className="signup-form__input signup-form__input--email"
            onChange={(e) => SetUserEmail(e.target.value)}
          />
          <button className="signup-form__button signup-form__button--check">중복 확인</button>
        </div>
        <p className="signup-form__text">비밀번호</p>
        <input
          type="password"
          id="password1"
          placeholder="비밀번호"
          className="signup-form__input"
          onChange={(p1) => SetPassword1(p1.target.value)}></input>
        <p className="signup-form__text">비밀번호 확인</p>
        <input
          type="password"
          id="password2"
          placeholder="비밀번호 확인"
          className="signup-form__input"
          onChange={(p2) => SetPassword2(p2.target.value)}></input>
        <p className="signup-form__text">전화번호</p>
        <input
          type="text"
          id="phone"
          placeholder="전화번호"
          className="signup-form__input"
          onChange={(phone) => SetPhone(phone.target.value)}></input>
        <button id="loginBut" className="signup-form__button">
          회원 가입
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
