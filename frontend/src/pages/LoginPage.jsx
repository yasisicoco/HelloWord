// import { useState } from 'react';
import LoginInput from '../components/LoginInput';

import './Login.sass';

const LoginPage = () => {
  return (
    <div className="login-Page">
      <section className="login-Logo">
        <img className="login-Logo__img" src="/gamethumbnail/favicon.png" alt="Logo" />
      </section>

      <section className="login-Input">
        <LoginInput />
      </section>
    </div>
  );
};

export default LoginPage;
