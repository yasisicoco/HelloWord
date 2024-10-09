import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserAPI from '../api/UserAPI';
import EmblaCarousel from '../components/EmblaCarousel';
import './HomePage.sass';
import game1 from '../assets/gameThumbnail/game1.png';
import game2 from '../assets/gameThumbnail/game2.png';
import game3 from '../assets/gameThumbnail/game3.png';
import game4 from '../assets/gameThumbnail/game4.png';
import User from '../assets/homeIcon/User.png';

import charImage1 from '../assets/character/mini.png';
import charImage2 from '../assets/character/middle.png';
import charImage3 from '../assets/character/adult.png';

const HomePage = () => {
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [name, setName] = useState(1);
  const [characterImage, setCharacterImage] = useState(charImage1);
  const [drawerOpen, setDrawerOpen] = useState(false); // 드로어 메뉴 열림/닫힘 상태 관리
  const drawerRef = useRef(); // 드로어 메뉴 영역을 참조하기 위한 ref
  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  // UserAPI로부터 레벨과 경험치 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserAPI().kidSearch(accessToken, kidId);
        setLevel(response.data.level);
        setExp(response.data.experience);
        setName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [accessToken, kidId]);

  // 레벨에 따라 캐릭터 이미지 변경
  useEffect(() => {
    if (level >= 1 && level <= 4) {
      setCharacterImage(charImage1);
    } else if (level >= 5 && level <= 9) {
      setCharacterImage(charImage2);
    } else if (level >= 10) {
      setCharacterImage(charImage3);
    }
  }, [level]);

  // 드로어 메뉴 열기/닫기 토글 함수
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // 메뉴 바깥을 클릭하면 드로어 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false); // 메뉴 바깥 클릭 시 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const gameItems = [
    { type: 'game1', image: game1 },
    { type: 'game2', image: game2 },
    { type: 'game3', image: game3 },
    { type: 'game4', image: game4 },
  ];

  return (
    <div className="home-page">
      <div className="setting-box" onClick={toggleDrawer}>
        <img src={User} alt="User Icon" />
      </div>

      {drawerOpen && <div className="overlay" onClick={() => setDrawerOpen(false)}></div>}

      <div className={`drawer-menu ${drawerOpen ? 'open' : ''}`} ref={drawerRef}>
        <div className="drawer-header">
          <h2>메뉴</h2>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>x</button>
        </div>
        <div className="drawer-links">
          <Link to="/profile">내 아이</Link>
          <Link to="/collection">학습 단어</Link>
          <Link to="/select-kid">아이 변경</Link>
          <Link to="/setings">내 정보 수정</Link>
          <Link to="/logout">로그아웃</Link>

        </div>
      </div>

      <section className="home-user">
        <div className="home-user__character">
          <img src={characterImage} alt="Character" className="home-user__character--image" />
        </div>
        <div className="home-user__exp">
          <div className="home-user__exp--text">
            LV{level} 먼지쿤, 경험치 {exp}%
          </div>
          <div className="home-user__exp--exp-wrap" style={{ width: `${exp}%` }} />
        </div>
      </section>

      <section className="home-game">
        <EmblaCarousel slides={gameItems} options={{ axis: 'y', loop: true }} storageKey="homeGameIndex" />
      </section>
    </div>
  );
};

export default HomePage;

