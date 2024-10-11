import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './GameMount.sass';

import game1 from '../assets/gameThumbnail/game1.png';
import game2 from '../assets/gameThumbnail/game2.png';
import game3 from '../assets/gameThumbnail/game3.png';
import game4 from '../assets/gameThumbnail/game4.png';

const GameMount = ({ kidData }) => {
  const gameItems = [
    {
      type: '단어카드',
      image: game1,
      chartData: {
        내아이정답률: kidData.speedGameKidAverageCorrectRate,
        평균정답률: kidData.speedGameGlobalAverageCorrectRate,
        내아이플레이타임: kidData.speedGameKidAveragePlayTime,
        평균플레이타임: kidData.speedGameGlobalAveragePlayTime
      }
    },
    {
      type: '단어말하기',
      image: game2,
      chartData: {
        내아이정답률: kidData.speechGameKidAverageCorrectRate,
        평균정답률: kidData.speechGameGlobalAverageCorrectRate,
        내아이플레이타임: kidData.speechGameKidAveragePlayTime,
        평균플레이타임: kidData.speechGameGlobalAveragePlayTime
      }
    },
    {
      type: '짝맞추기',
      image: game3,
      chartData: {
        내아이정답률: kidData.pairGameKidAverageCorrectRate,
        평균정답률: kidData.pairGameGlobalAverageCorrectRate,
        내아이플레이타임: kidData.pairGameKidAveragePlayTime,
        평균플레이타임: kidData.pairGameGlobalAveragePlayTime
      }
    },
    {
      type: '동화완성하기',
      image: game4,
      chartData: {
        내아이정답률: kidData.fairytaleGameKidAverageCorrectRate,
        평균정답률: kidData.fairytaleGameGlobalAverageCorrectRate,
        내아이플레이타임: kidData.fairytaleGameKidAveragePlayTime,
        평균플레이타임: kidData.fairytaleGameGlobalAveragePlayTime
      }
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? gameItems.length - 1 : prevIndex - 1));
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === gameItems.length - 1 ? 0 : prevIndex + 1));
  };

  const currentGame = gameItems[currentIndex];

  const chartData = [
    {
      name: currentGame.type,  // 이 부분은 그대로 두되, XAxis에서 formatter로 처리
      내아이: currentGame.chartData.내아이정답률,
      평균: currentGame.chartData.평균정답률,
      내아이플레이타임: currentGame.chartData.내아이플레이타임,
      평균플레이타임: currentGame.chartData.평균플레이타임
    }
  ];

  return (
    <div className="gamemount-compo">
      {/* 왼쪽에 게임 종류 캐러셀 */}
      <section className="game-info">
        <div className="game-info__img" ref={carouselRef}>
          <img
            onClick={() => console.log(`게임 클릭: ${currentGame.type}`)}
            className="game-info__carousel"
            src={currentGame.image}
            alt={currentGame.type}
          />
          <div className="game-info__controls">
            <div onClick={handlePrevClick} className="game-info__controls--prev">
              <FaArrowLeft />
            </div>
            <p className="game-info__controls--text">{currentGame.type}</p>
            <div onClick={handleNextClick} className="game-info__controls--next">
              <FaArrowRight />
            </div>
          </div>
        </div>
      </section>

      {/* 오른쪽에 두 개의 차트 */}
      <section className="progress">
        <div className="progress__label">통계</div>
        <div className="progress__chart">
          {/* 첫 번째 차트: 정답률 */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={() => '정답률'}  // X축의 항목을 "정답률"로 변경
              />
              <YAxis width={40} />
              <Tooltip contentStyle={{ fontSize: '0.75rem' }} />  {/* Tooltip 폰트 크기 줄이기 */}
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />  {/* Legend 폰트 크기 줄이기 */}
              <Bar dataKey="내아이" fill="#8884d8" name="내 아이" />
              <Bar dataKey="평균" fill="#82ca9d" name="평균" />
            </BarChart>
          </ResponsiveContainer>

          {/* 두 번째 차트: 학습 시간 */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={() => '플레이 시간'}  // X축의 항목을 "학습 시간"으로 변경
              />
              <YAxis width={40} />
              <Tooltip contentStyle={{ fontSize: '0.75rem' }} />  {/* Tooltip 폰트 크기 줄이기 */}
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />  {/* Legend 폰트 크기 줄이기 */}
              <Bar dataKey="내아이플레이타임" fill="#ffc658" name="내 아이" />
              <Bar dataKey="평균플레이타임" fill="#ff8042" name="평균" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default GameMount;
