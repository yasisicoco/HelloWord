import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LearningMount from '../components/LearningMount';
import GameMount from '../components/GameMount';
import PortraitModeWarning from '../features/Games/portraitModeWarning';

import { IoAddCircleOutline } from 'react-icons/io5';
import './UserPage.sass';

const UserPage = () => {
  const [active, setActive] = useState('learning');
  const nav = useNavigate();

  return (
    <div className="user-page">
      <PortraitModeWarning />

      <section className="top-nav">
        <button className="top-nav__back-space" onClick={() => nav(-1)}>
          뒤로
        </button>
        <div className="top-nav__middle-container">
          <button onClick={() => setActive('learning')} className="top-nav__middle-container--study-button">
            학습량
          </button>
          <button onClick={() => setActive('statics')} className="top-nav__middle-container--status">
            통계
          </button>
        </div>
        <div className="top-nav__add-child">
          <IoAddCircleOutline onClick={open} className="top-nav__add-child--svg" />
        </div>
      </section>
      <section className="main-content">
        {active === 'learning' && <LearningMount />}
        {active === 'statics' && <GameMount />}
      </section>
    </div>
  );
};

export default UserPage;
