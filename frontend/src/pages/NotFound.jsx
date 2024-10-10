import React from 'react';
import './NotFound.sass';
import guiyomi from '../assets/character/guiyomi.png';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <img src={guiyomi} alt="귀여운 캐릭터" />
        <h1>페이지를 찾을 수 없습니다.</h1>
        <a href="/">홈으로 돌아가기</a>
      </div>
    </div>
  );
};

export default NotFound;
