import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const gameItems = [
    { type: 'game1', image: game1 },
    { type: 'game2', image: game2 },
    { type: 'game3', image: game3 },
    { type: 'game4', image: game4 },
  ];

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? gameItems.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === gameItems.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const mockData = { user: { exp: 70 } };
    setExp(mockData.user.exp);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateY(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  return (
    <div className="home-page">
      <section className="home-user">
        <div className="home-user__exp">
          <div className="home-user__exp--exp-wrap" style={{ width: `${exp}%` }}>
            {exp}%
          </div>
        </div>
        <div className="home-user__character">
          <img src="/charactor/rabbit.png" alt="Rabbit" className="home-user__character--image" />
        </div>
        <div className="home-user__sub-menu">
          <Link to={'collection'} className="home-user__sub-menu--button">
            <Button img={User} />
          </Link>
          <Link to={'stat'} className="home-user__sub-menu--button">
            <Button img={GoldMedal} />
          </Link>
          <Link to={'setting'} className="home-user__sub-menu--button">
            <Button img={Settings} />
          </Link>
        </div>
      </section>

      <section className="home-game">
        <div className="home-gamelist__container">
          <button className="home-gamelist__button button-up" onClick={handlePrevClick}>
            위로
          </button>
          <div className="home-gamelist__carousel-wrapper">
            <div className="home-gamelist__carousel" ref={carouselRef}>
              {gameItems.map((item, index) => (
                <div key={item.type} className="home-gamelist__game">
                  <img className="home-gamelist__game--thumbnail" src={item.image} alt={item.type} />
                </div>
              ))}
            </div>
          </div>
          <button className="home-gamelist__button button-down" onClick={handleNextClick}>
            아래로
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
