import './Story.sass';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbPlayerTrackNext } from 'react-icons/tb';
import PortraitModeWarning from '../features/Games/portraitModeWarning';

import story1 from '../assets/guide/story1.jpg';
import story2 from '../assets/guide/story2.jpg';
import story3 from '../assets/guide/story3.jpg';
import story4 from '../assets/guide/story4.jpg';
import story5 from '../assets/guide/story5.jpg';
import story6 from '../assets/guide/story6.jpg';

const storyData = [
  {
    image: story1,
    text: '     먼 옛날, 이야기 숲이라는 마법의 숲이 있었습니다.',
  },
  {
    image: story2,
    text: '     이 숲의 나무들은 다른 나무들과 달리 이야기로 자라났어요.',
  },
  {
    image: story3,
    text: '     친구들과 서로 이야기를 하면 나무는 자라났고, 숲은 더욱 더 풍성해졌죠.',
  },
  {
    image: story4,
    text: '     그런데, 시간이 지나면서 숲 속의 친구들이 떠나갔고, 숲은 점차 힘을 잃고 말았어요.',
  },
  {
    image: story5,
    text: '     어디선가, 숲을 지키는 아기 부엉이가 나타나 도움을 요청합니다.',
  },
  {
    image: story6,
    text: '      "나무들을 다시 살리려면 이야기를 모아야 해! 숲을 도와줘!"',
  },
];

const StoryPage = () => {
  const [number, setNumber] = useState(0);
  const [fade, setFade] = useState(false); // 이미지 교차를 위한 상태
  const [isClickDisabled, setIsClickDisabled] = useState(false); // 클릭 차단 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 클릭 차단 활성화
    setIsClickDisabled(true);

    setTimeout(() => {
      setIsClickDisabled(false); // 애니메이션이 없어졌으므로 바로 클릭 가능하게 설정
    }, 1000); // 애니메이션 대신 텍스트 표시 후 1초 기다림
  }, [number]);

  const imageChange = () => {
    // 클릭이 비활성화된 상태일 때는 클릭 방지
    if (isClickDisabled) return;

    setFade(true);
    setIsClickDisabled(true); // 페이지 전환 중 클릭 차단

    setTimeout(() => {
      if (number < storyData.length - 1) {
        setNumber(number + 1);
      } else {
        navigate('/home');
      }
      setFade(false);
      setIsClickDisabled(false); // 페이지가 전환된 후 클릭 가능하게 설정
    }, 1000);
  };

  return (
    <div className="Story-Page">
      <PortraitModeWarning />

      <div className="story-form">
        {/* 그림 들어가는 화면 */}
        <section className="story-form__background" onClick={imageChange}>
          <div
            className={`story-image ${fade ? 'fade-out' : 'fade-in'}`}
            style={{
              width: '80vw',
              height: '65vh',
              backgroundImage: `url(${storyData[number].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
              borderRadius: '10px',
            }}></div>
        </section>

        {/* 말하기 언어 넣는 위치 */}
        <section className="story-form__script" onClick={imageChange}>
          <p className="story-form__script--font">{storyData[number].text}</p>
          <TbPlayerTrackNext className="story-form__script--next" />
        </section>
      </div>
    </div>
  );
};

export default StoryPage;
