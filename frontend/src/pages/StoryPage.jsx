import './Story.sass';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbPlayerTrackNext } from 'react-icons/tb';

const storyData = [
  {
    image: '../storyline/story1.JPG',
    text: '     먼 옛날, 이야기 숲이라는 마법의 숲이 있었습니다.',
  },
  {
    image: '../storyline/story2.JPG',
    text: '     이 숲의 나무들은 다른 나무들과 달리 이야기로 자라났어요.',
  },
  {
    image: '../storyline/story3.JPG',
    text: '     친구들과 서로 이야기를 하면 나무는 자라났고, 숲은 더욱 더 풍성해졌죠.',
  },
  {
    image: '../storyline/story4.JPG',
    text: '     그런데, 시간이 지나면서 숲 속의 친구들이 떠나갔고, 숲은 점차 힘을 잃고 말았어요.',
  },
  {
    image: '../storyline/story5.JPG',
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
  const navigate = useNavigate();

  useEffect(() => {
    const text = storyData[number].text;
    let index = 0;

    // 먼저 텍스트를 초기화
    setDisplayedText('');

    // interval을 통해 글자를 하나씩 추가
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]); // 이전 텍스트에 현재 글자 추가
      index++;

      if (index >= text.length - 1) {
        clearInterval(interval); // 모든 글자가 출력되면 종료
      }
    }, 60); // 글자가 하나씩 나오는 속도 (ms 단위)

    return () => clearInterval(interval); // 컴포넌트가 언마운트되면 정리
  }, [number]);

  const imageChange = () => {
    setFade(true);

    setTimeout(() => {
      if (number < storyData.length - 1) {
        setNumber(number + 1);
      } else {
        navigate('/home');
      }
      setFade(false);
    }, 1000);
  };

  return (
    <div className="Story-Page">
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
