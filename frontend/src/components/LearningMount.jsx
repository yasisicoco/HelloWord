import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './LearningMount.sass';

const LearningMount = ({ kidData }) => {
  // kidData의 요일 데이터를 날짜 형식으로 변환하는 함수
  const getLast7Days = () => {
    const result = [];
    const today = new Date(); // 오늘 날짜 가져오기

    // 7일간의 날짜를 "MM/DD" 형식으로 구함
    for (let i = 6; i >= 0; i--) {
      const pastDate = new Date(today); // 날짜 복제
      pastDate.setDate(today.getDate() - i); // i일 전 날짜 계산
      const formattedDate = `${pastDate.getMonth() + 1}/${pastDate.getDate()}`; // "MM/DD" 형식으로 날짜 표시
      result.push({
        date: formattedDate,
        day: pastDate.getDay(), // 요일을 얻음 (0: 일요일, 1: 월요일, ... 6: 토요일)
      });
    }

    return result;
  };

  const last7Days = getLast7Days();

  // 요일 매핑 (0: 일요일, 1: 월요일, ... 6: 토요일)
  const dayMap = ["일", "월", "화", "수", "목", "금", "토"];

  // 차트에 사용할 데이터를 생성합니다.
  const chartData = last7Days.map(({ date, day }) => ({
    name: date,
    내아이: kidData.dailyCorrectWordCounts[dayMap[day]] || 0, // 맞춘 개수 (없는 경우 0)
    평균: kidData.globalDailyAverageCorrectWordCounts[dayMap[day]] || 0, // 글로벌 평균 맞춘 개수
  }));

  // 초 단위를 분과 초로 변환하는 함수
  const formatPlayTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60); // 분
    const seconds = totalSeconds % 60; // 초
    return `${minutes}분 ${seconds}초`;
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
            <p className="data-item__value">{formatPlayTime(kidData.todayPlayTime)}</p> {/* 학습 시간 포맷팅 적용 */}
          </div>
          <div className="data-item">
            <p className="data-item__label">오늘 완료한 게임</p>
            <p className="data-item__value">{kidData.todayCompletedGames} 게임</p>
          </div>
        </div>
      </section>

      <section className="progress">
        <div className="progress__label">주간 학습량</div>
        <div className="progress__chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} /> {/* tick 속성으로 글꼴 크기 조정 */}
              <YAxis width={30} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="내아이" stroke="#8884d8" strokeWidth={5} dot={false} /> {/* dot을 false로 설정 */}
              <Line type="monotone" dataKey="평균" stroke="#82ca9d" strokeWidth={5} dot={false} /> {/* dot을 false로 설정 */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default LearningMount;
