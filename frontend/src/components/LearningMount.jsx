import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './LearningMount.sass';

const LearningMount = () => {
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
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div className="learning-compo">
      <section className="child-info">
        <div className="child-info__name">아이 이름</div>
        <div className="child-info__picture">아이 사진</div>
        <div className="child-info__data">
          <div className="data-item">
            <p className="data-item__label">오늘 학습한 시간</p>
            <p className="data-item__value">12분</p>
          </div>
          <div className="data-item">
            <p className="data-item__label">오늘 완료한 게임</p>
            <p className="data-item__value">2게임</p>
          </div>
        </div>
      </section>
      <section className="progress">
        <div className="progress__label">학습량</div>
        <div className="progress__calendar">
          <button className="calendar__button calendar__button--week">주</button>
          <button className="calendar__button calendar__button--month">월</button>
        </div>
        <div className="progress__chart">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              {/* <Tooltip /> */}
              {/* <Legend /> */}
              <Bar dataKey="uv" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default LearningMount;
