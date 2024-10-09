import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './LearningMount.sass';

const LearningMount = ({ kidData }) => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const chartData = days.map(day => ({
    name: day,
    내아이: kidData.dailyCorrectWordCounts[day],
    평균: kidData.globalDailyAverageCorrectWordCounts[day],
  }));

  // 초를 분으로 변환하고 소수점을 올림하는 함수
  const convertSecondsToMinutes = (seconds) => {
    return Math.ceil(seconds / 60);
  };

  return (
    <div className="learning-compo">
      <section className="child-info">
        <div className="child-info__name">{kidData.name}</div>
        <div className="child-info__picture">
          <img src={kidData.profileImageUrl} alt={kidData.name} />
        </div>
        <div className="child-info__data">
          <div className="data-item">
            <p className="data-item__label">오늘 학습한 시간</p>
            <p className="data-item__value">
              {kidData.todayPlayTime ? `${convertSecondsToMinutes(kidData.todayPlayTime)}분` : '0 분'}
            </p>
          </div>
          <div className="data-item">
            <p className="data-item__label">오늘 완료한 게임</p>
            <p className="data-item__value">{kidData.todayCompletedGames} 게임</p>
          </div>
        </div>
      </section>

      <section className="progress">
        <div className="progress__label">7일간 학습량 비교</div>
        <div className="progress__chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis width={40} />
              <Tooltip />
              <Legend />
              <Bar dataKey="내아이" fill="#8884d8" />
              <Bar dataKey="평균" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default LearningMount;
