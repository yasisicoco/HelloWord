// hook
import { useState, useEffect } from 'react';

// compo
import TimeBar from '../../components/TimeBar';

// sass
import './Game1Page.sass';

const Game1Page = () => {
  return (
    <div className="game1-page">
      <section className="top-nav">
        <button className="top-nav__back-space">뒤로가기</button>
        <div className="top-nav__time-stamp">
          <TimeBar className="top-nav__time-stamp--Timebar" time={5} />
        </div>
        <div className="top-nav__bookmarker">페이지</div>
      </section>
      <section className="middle-content">
        <div className="middle-content__img-wrap">
          <img src="/charactor/rabbit.png" alt="캐릭터 이미지" className="middle-content__img-wrap--img" />
        </div>
        <div className="middle-content__card-container">
          <div className="middle-content__card-container--card-wrap">WORD</div>
          <div className="middle-content__card-container--card-wrap">WORD</div>
          <div className="middle-content__card-container--card-wrap">WORD</div>
          <div className="middle-content__card-container--card-wrap">WORD</div>
        </div>
      </section>
      <section className="footer">
        <button className="footer__play-button">재생하기</button>
      </section>
    </div>
  );
};

export default Game1Page;
