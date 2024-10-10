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
    image: '../storyline/story5.JPG',
    text: '      "나무들을 다시 살리려면 이야기를 모아야 해! 숲을 도와줘!"',
  },
];

const StoryPage = () => {
  const [number, setNumber] = useState(0);
  const [displayedText, setDisplayedText] = useState(''); // 애니메이션된 텍스트
  const [fade, setFade] = useState(false); // 이미지 교차를 위한 상태
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태
  const [isClickDisabled, setIsClickDisabled] = useState(false); // 클릭 차단 상태
  const navigate = useNavigate();

  useEffect(() => {
    const text = storyData[number].text;
    let index = 0;

    // 클릭 차단 활성화
    setIsClickDisabled(true);
    setDisplayedText('');
    setIsAnimating(true); // 애니메이션 시작

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]); // 이전 텍스트에 현재 글자 추가
      index++;

      if (index >= text.length - 1) {
        clearInterval(interval); // 모든 글자가 출력되면 종료
        setIsAnimating(false); // 애니메이션 종료
        setIsClickDisabled(false); // 클릭 차단 해제
      }
    }, 60); // 글자가 하나씩 나오는 속도 (ms 단위)

    return () => clearInterval(interval); // 컴포넌트가 언마운트되면 정리
  }, [number]);

  const imageChange = () => {
    // 클릭이 비활성화된 상태거나 애니메이션이 진행 중일 때는 클릭 방지
    if (isAnimating || isClickDisabled) return;

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
          <p className="story-form__script--font">{displayedText}</p>
          <TbPlayerTrackNext className="story-form__script--next" />
        </section>
      </div>
    </div>
  );
};

export default StoryPage;
