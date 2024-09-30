import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

import './GameMount.sass';

import game1 from '../assets/gameThumbnail/game1.png';
import game2 from '../assets/gameThumbnail/game2.png';
import game3 from '../assets/gameThumbnail/game3.png';
import game4 from '../assets/gameThumbnail/game4.png';

const GameMount = () => {
  // 게임 이미지를 배열로 저장
  const gameItems = [
    { type: 'game1', image: game1 },
    { type: 'game2', image: game2 },
    { type: 'game3', image: game3 },
    { type: 'game4', image: game4 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselRef = useRef(null);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? gameItems.length - 1 : prevIndex - 1));
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === gameItems.length - 1 ? 0 : prevIndex + 1));
  };

  const mockdata = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
  ];

  return (
    <div className="gamemount-compo">
      <section className="game-info">
        <div className="game-info__img" ref={carouselRef}>
          {/* 현재 선택된 게임만 표시 */}
          <img
            onClick={() => console.log(`게임 클릭: ${gameItems[currentIndex].type}`)}
            className="game-info__carousel"
            src={gameItems[currentIndex].image}
            alt={gameItems[currentIndex].type}
          />
          <div className="game-info__controls">
            <button onClick={handlePrevClick} className="game-info__controls--prev">
              앞
            </button>
            <p className="game-info__controls--text">{gameItems[currentIndex].type}</p>
            <button onClick={handleNextClick} className="game-info__controls--next">
              뒤
            </button>
          </div>
        </div>
      </section>
      <section className="progress">
        <div className="progress__label">게임 1 통계</div>
        <div className="progress__chart">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              {/* <YAxis /> */}
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default GameMount;
