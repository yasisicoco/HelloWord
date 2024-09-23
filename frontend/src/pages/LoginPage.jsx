import { useState } from "react";
import LoginInput from "../components/LoginInput";

import "./Login.css";

const LoginPage = () => {
  const [exp, setExp] = useState(50);
  return (
    <div className="Login">
      <section className="MainLogo"> {/*} 로고 이미지 넣는 곳 {*/}
        <img className="Logoimg" src="/gamethumbnail/favicon.png" alt="Logo" />
      </section>

      <section className="Input"> {/*} 아이디 비밀번호 입력 구역 {*/}
        <LoginInput />
      </section>
    </div>
  );
};

export default LoginPage;
