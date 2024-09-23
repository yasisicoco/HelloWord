import { useState } from 'react';
import LoginInput from '../components/LoginInput';

import './Login.sass';

const LoginPage = () => {
  const [exp, setExp] = useState(50);

  return (
    <div className="login-Page">
      <section className="login-Logo">
        {/*} 로고 이미지 넣는 곳 {*/}
        <img className="login-Logo__img" src="/gamethumbnail/favicon.png" alt="Logo" />
      </section>

      <section className="login-Input">
        {/*} 아이디 비밀번호 입력 구역 {*/}
        <LoginInput />
      </section>
    </div>
  );
};

export default LoginPage;
