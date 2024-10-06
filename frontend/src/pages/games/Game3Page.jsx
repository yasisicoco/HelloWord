// hook
import { useNavigate } from 'react-router-dom';

// compo
import TimeBar from '../../components/TimeBar';

// style
import './Game3Page.sass';

const Game3Page = () => {
  const nav = useNavigate();

  return (
    <div className="game3-page">
      <section className="top-nav">
        <button onClick={() => nav(-1)} className="top-nav__back-space">
          뒤로가기
        </button>
        <div className="top-nav__time-stamp">
          <TimeBar className="top-nav__time-stamp--timebar" time={5} />
        </div>
        <div className="top-nav__bookmarker">페이지</div>
      </section>
      <section className="main-content">
        <div className="main-content__card">ㅇㅇ</div>
        <div className="main-content__card">ㅇㅇ</div>
        <div className="main-content__card">ㅇㅇ</div>
        <div className="main-content__card">ㅇㅇ</div>
        <div className="main-content__card">ㅇㅇ</div>
        <div className="main-content__card">ㅇㅇ</div>
        <div className="main-content__card">ㅇㅇ</div>
        <div className="main-content__card">ㅇㅇ</div>
      </section>
    </div>
  );
};

export default Game3Page;