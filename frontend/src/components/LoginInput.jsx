import React, { useState } from "react";
import "./LoginInput.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginInput = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    // await new Promise((r) => setTimeout(r, 1000)); // 일단 대기

    console.log(email)
    console.log(password)

     // axios로 로그인정보 받기
    // const resposne = await axios.post(
    //   '')
    //   .then((res) => {
    //     // res
    //       // 토큰 저장 및 네이게이터로 home으로 보내기
    //     navigate('/home');
    //   })
    //   .catch((error) => {
    //     //error
    //   })
  };

  return (
    <section className="Input">
      <form onSubmit={handleLogin}>
        <div className="loginForm">
          <div className='containerAlign'>
            <p className="loginFont">아이디</p>
            <input type="text" className="boxForm" id="userId" placeholder="" autoFocus onChange={(e) => setEmail(e.target.value)}></input>
            <p className="loginFont">비밀번호</p>
            <input type="password" className="boxForm" id="password" placeholder="" onChange = {(e => setPassword(e.target.value))}></input>
            <p className="signFont">회원가입 / 비밀번호 찾기</p>
            <button id="loginBut">로그인</button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default LoginInput;
