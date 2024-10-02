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
  const [username, SetName] = useState('');

  // 에러 여부 확인 (실시간 확인)
  const [isEmailCheck, SetemailCheck] = useState(false);
  const [passCheck, SetpasswordCheck] = useState(false);
  const [phoneCheck, SetphoneCheck] = useState(false);
  // 모든 조건 확인 완료 시 회원가입 버튼 활성화
  const [allCheck, SetAllCheck] = useState(false);

  // 휴대폰 양식 확인
  const [phoneChange, SetChangePhone] = useState('');

  useEffect(() => {
    // 비밀번호 체크
    SetpasswordCheck((password1 === password2) & password1 & password2);

    // 휴대폰 체크
    if (phone.length === 10) {
      SetChangePhone(phoneChange.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
      SetphoneCheck(true);
    } else if (phone.length === 11) {
      SetChangePhone(phoneChange.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
      SetphoneCheck(true);
    } else {
      SetphoneCheck(false);
    }

    // 전부 확인
    SetAllCheck(isEmailCheck & passCheck & phoneCheck);
  }, [passCheck, isEmailCheck, password1, password2, phone, phoneCheck]);

  useEffect(() => {
    SetemailCheck(false);
  }, [email]);

  // 회원가입 정보 전달
  const handleSignUp = async (event) => {
    event.preventDefault();
    // 여기다가 회원가입 정보 전달하기
    const response = await UserAPI().signUp(email, password1, username, phone);
    if (response) {
      navigate('/login');
    } else {
      alert('서버 오류로 인하여 재가입 해주세요.');
    }
  };

  // 아이디 유효성 검사 및 중복 검사 Handler
  const idCheckHandler = async (email) => {
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
    if (!emailRegEx.test(email)) {
      SetemailCheck(false);
      alert('이메일 양식을 확인하세요');
      return;
    }

    const emailCheck = await UserAPI().idDuplicate(email);
    if (!emailCheck) {
      alert('중복된 이메일 입니다.');
      return;
    }

    // 이메일 체크
    SetemailCheck(emailCheck);
  };

  // 전화번호 자동 변환기
  const phoneNumberChange = async (phone) => {
    const num = phone.replaceAll('-', '');
    SetPhone(num);
    // 휴대폰 번호 유효성 검증
    const regex1 = /^[0-9\b -]{0,15}$/; // 특수문자 방지
    const regex2 = /^[0-9\b -]{0,11}$/; // 12글자 이상 방지
    if (regex1.test(num)) {
      if (regex2.test(num)) {
        SetChangePhone(num);
      } else {
        alert('전화번호는 11 글자 이하로 작성해주세요.');
        SetPhone(num.slice(0, 11));
      }
    } else {
      alert('전화번호는 숫자만 입력할 수 있습니다.');
    }
  };

  return (
    <section className="signup-page">
      <form onSubmit={handleSignUp} className="signup-form">
        <div className="signup-form__close">
          <IoClose className="" onClick={() => navigate('/login')} />
        </div>
        <p className="signup-form__text">이메일</p>
        <div className="signup-form__input2">
          <input
            type="text"
            id="userId"
            className="signup-form__input2--box2"
            onChange={(e) => SetEmail(e.target.value)}
          />
          <button
            className="signup-form__input2--button0"
            onClick={(e) => {
              e.preventDefault();
              idCheckHandler(email);
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
        <div className="signup-form__input">
          <input
            type="password"
            id="password1"
            className="signup-form__input--box1"
            onChange={(p1) => SetPassword1(p1.target.value)}></input>
        </div>
        <p className="signup-form__text">비밀번호 확인</p>
        <div className="signup-form__input">
          <input
            type="password"
            id="password2"
            className="signup-form__input--box1"
            onChange={(p2) => SetPassword2(p2.target.value)}></input>
        </div>
        <p className="signup-form__text">이름</p>
        <div className="signup-form__input">
          <input
            type="text"
            id="username"
            className="signup-form__input--box1"
            onChange={(name) => SetName(name.target.value)}></input>
        </div>
        <p className="signup-form__text">전화번호</p>
        <div className="signup-form__input">
          <input
            type="text"
            id="phone"
            className="signup-form__input--box1"
            value={phoneChange}
            onChange={(phone) => phoneNumberChange(phone.target.value)}></input>
        </div>
        <button
          id="loginBut"
          className={`${allCheck ? 'signup-form__buttonO' : 'signup-form__buttonX'}`}
          disabled={!allCheck}>
          회원 가입
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
