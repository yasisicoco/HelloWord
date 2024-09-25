import TimeBar from '../../components/TimeBar';

import './Game2Page.sass';

const Game2Page = () => {
  return (
    <div className="game2-page">
      <section className="top-nav">
        <button className="top-nav__back-space">뒤로가기</button>
        <div className="top-nav__time-stamp">
          <TimeBar className="top-nav__time-stamp--timebar" time={10} />
        </div>
        <div className="top-nav__bookmarker">페이지</div>
      </section>

      <section className="main-content">
        <div className="main-content__img-wrap">
          <img src="/charactor/rabbit.png" alt="캐릭터 이미지" className="main-content__img-wrap--img" />
        </div>
        <div className="main-content__card-container">
          <div className="main-content__card-container--word-card">위박스</div>
          <div className="main-content__card-container--mic-card">아래박스</div>
        </div>
      </section>
    </div>
  );
};

export default Game2Page;
