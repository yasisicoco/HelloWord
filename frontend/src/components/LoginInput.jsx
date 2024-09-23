import React, { useState } from 'react';
import './LoginInput.sass';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginInput = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    // await new Promise((r) => setTimeout(r, 1000)); // 일단 대기
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
        <p className="login-form__signFont">회원가입 / 비밀번호 찾기</p>
        <button className="login-form__loginbox">로그인</button>
      </form>
    </section>
  );
};

export default LoginInput;
