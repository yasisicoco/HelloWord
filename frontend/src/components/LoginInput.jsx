import React, { useState } from 'react';
import './LoginInput.sass';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/Auth/authSlice';

const LoginInput = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email) {
      return alert('아이디를 입력하세요.');
    } else if (!password) {
      return alert('비밀번호를 입력하세요.');
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/home');
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <section className="login-Compo">
      <form onSubmit={handleLogin} className="login-form">
        <p className="login-form__loginFont">아이디</p>
        <input
          type="text"
          className="login-form__box"
          id="userId"
          placeholder=""
          autoFocus
          onChange={(e) => setEmail(e.target.value)}></input>
        <p className="login-form__loginFont">비밀번호</p>
        <input
          type="password"
          className="login-form__box"
          id="password"
          placeholder=""
          onChange={(e) => setPassword(e.target.value)}></input>
        <div className="login-form__textalign">
          <p onClick={() => navigate('/signup')} className="login-form__signFont">
            회원가입
          </p>
          <p className="login-form__signFont"> / </p>
          <p onClick={() => navigate('/password')} className="login-form__signFont">
            비밀번호 찾기
          </p>
        </div>
        <button className="login-form__loginbox">로그인</button>
      </form>
    </section>
  );
};

export default LoginInput;
