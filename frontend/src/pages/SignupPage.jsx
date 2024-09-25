import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserAPI from '../api/UserAPI';

import './Signup.sass';

const SignupPage = () => {
  const navigate = useNavigate();

  // 유저 정보
  const [email, SetEmail] = useState('');
  const [password1, SetPassword1] = useState('');
  const [password2, SetPassword2] = useState('');
  const [phone, SetPhone] = useState('');

  // 에러 여부 확인 (실시간 확인)
  const [isEmailCheck, SetemailCheck] = useState(false);
  const [passErr, SetpasswordCheck] = useState(false);
  const [phoneErr, SetphoneCheck] = useState(false);

  useEffect(() => {
    if (password1 == password2) {
      SetpasswordCheck(true);
    } else {
      SetpasswordCheck(false);
    }
  });

  // 회원가입 정보 전달
  const handleLogin = async (event) => {
    event.preventDefault();
    // 여기다가 회원가입 정보 전달하기
  };

  // 아이디 유효성 검사 및 중복 검사 Handler
  const idCheckHandler = async (email) => {
    // 이메일 중복확인 API 추가
    alert('중복확인완료');
    const emailCheck = await UserAPI().idDuplicate(email);
    SetemailCheck(emailCheck);
  };

  return (
    <section className="signup-page">
      <form onSubmit={handleLogin} className="signup-form">
        <div className="signup-form__close">
          <IoClose className="" onClick={() => navigate('/login')} />
        </div>
        <p className="signup-form__text">이메일</p>
        <div className="signup-form__email-container">
          <input
            type="text"
            id="userId"
            autoFocus
            placeholder="이메일"
            className="signup-form__input signup-form__input--email"
            onChange={(e) => SetEmail(e.target.value)}
          />
          <button
            className={`signup-form__button signup-form__button--check ${isEmailCheck ? '' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              idCheckHandler();
            }}>
            {isEmailCheck ? (
              <>
                <FaCheckCircle />
              </>
            ) : (
              '중복확인'
            )}
          </button>
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
