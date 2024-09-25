// compo
import TimeBar from '../../components/TimeBar';

import './Game4Page.sass';

const Game4Page = () => {
  return (
    <div className="game4-page">
      <section className="top-nav">
        <button className="top-nav__back-space">뒤로가기</button>
        <div className="top-nav__time-stamp">
          <TimeBar className="top-nav__time-stamp--timebar" time={5} />
        </div>
        <div className="top-nav__bookmarker">페이지</div>
      </section>

      <section className="main-content">
        <div className="book-container">
          <div className="book-container__img-wrap">
            <img className="book-container__img-wrap--img" src="/charactor/rabbit.png" alt="" />
          </div>
          <div className="book-container__story-wrap">
            <div className="book-container__story-wrap--text">내용</div>
          </div>
        </div>
        <div className="card-container">
          <div className="card-container--card-wrap">WORD</div>
          <div className="card-container--card-wrap">WORD</div>
          <div className="card-container--card-wrap">WORD</div>
          <div className="card-container--card-wrap">WORD</div>
        </div>
      </section>
    </div>
  );
};

export default Game4Page;
