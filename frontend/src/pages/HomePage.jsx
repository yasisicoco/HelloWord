// hook, lib
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// img, component
import EmblaCarousel from '../components/EmblaCarousel';
import Button from '../components/Button';
import './HomePage.sass';
import game1 from '../assets/gameThumbnail/game1.png';
import game2 from '../assets/gameThumbnail/game2.png';
import game3 from '../assets/gameThumbnail/game3.png';
import game4 from '../assets/gameThumbnail/game4.png';
import User from '../assets/homeIcon/User.png';
import GoldMedal from '../assets/homeIcon/GoldMedal.png';
import Settings from '../assets/homeIcon/Settings.png';

const HomePage = () => {
  const [exp, setExp] = useState(50);
  const [character, setCharacter] = useState('먼지쿤');
  const nav = useNavigate();

  const gameItems = [
    { type: 'game1', image: game1 },
    { type: 'game2', image: game2 },
    { type: 'game3', image: game3 },
    { type: 'game4', image: game4 },
  ];

  useEffect(() => {
    const mockData = { user: { exp: 70 } };
    setExp(mockData.user.exp);
  }, []);

  return (
    <div className="home-page">
      <section className="home-user">
        <div className="home-user__exp">
          <div className="home-user__exp--exp-wrap" style={{ width: `${exp}%` }}>
            {character} {exp}%
          </div>
        </div>
        <div className="home-user__character">
          <img src="/charactor/rabbit.png" alt="Rabbit" className="home-user__character--image" />
        </div>
        <div className="home-user__sub-menu">
          <Link to={'userpage'} className="home-user__sub-menu--button">
            <Button img={User} />
          </Link>
          <Link to={'collection'} className="home-user__sub-menu--button">
            <Button img={GoldMedal} />
          </Link>
          <Link to={'settings'} className="home-user__sub-menu--button">
            <Button img={Settings} />
          </Link>
        </div>
      </section>

      <section className="home-game">
        <EmblaCarousel slides={gameItems} options={{ axis: 'y', loop: true }} storageKey="homeGameIndex" />
      </section>
    </div>
  );
};

export default HomePage;
