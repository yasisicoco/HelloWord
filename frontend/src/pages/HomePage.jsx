import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Button from '../components/Button';

import './HomePage.sass';
import game1 from '../assets/gameThumbnail/game1.png';
import game2 from '../assets/gameThumbnail/game2.png';
import game3 from '../assets/gameThumbnail/game3.png';
import game4 from '../assets/gameThumbnail/game4.png';

const HomePage = () => {
  const [exp, setExp] = useState(50);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mockData = {
    user: {
      exp: 70, // 사용자 경험치 70%로 설정
    },
  };

  useEffect(() => {
    setExp(mockData.user.exp);
  }, []);

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
            <Button />
          </Link>
          <Link to={'stat'} className="home-user__sub-menu--button">
            <Button />
          </Link>
          <Link to={'setting'} className="home-user__sub-menu--button">
            <Button />
          </Link>
        </div>
      </section>

      <section className="home-game">
        <div className="home-gamelist__container">
          <button className="home-gamelist__button" onClick={handlePrevClick}>
            위로
          </button>
          <div className="home-gamelist__game">
            <img
              className="home-gamelist__game--thumbnail"
              src={currentIndex === 0 ? gameItems[gameItems.length - 1].image : gameItems[currentIndex - 1].image}
              alt={currentIndex === 0 ? gameItems[gameItems.length - 1].type : gameItems[currentIndex - 1].type}
            />
            <img
              className="home-gamelist__game--thumbnail"
              alt={gameItems[currentIndex].type}
              src={gameItems[currentIndex].image}
            />
            <img
              className="home-gamelist__game--thumbnail"
              src={currentIndex === gameItems.length - 1 ? gameItems[0].image : gameItems[currentIndex + 1].image}
              alt={currentIndex === gameItems.length - 1 ? gameItems[0].type : gameItems[currentIndex + 1].type}
            />
          </div>
          <button className="home-gamelist__button" onClick={handleNextClick}>
            아래로
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
