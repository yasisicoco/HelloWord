import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserAPI from '../api/UserAPI';
import EmblaCarousel from '../components/EmblaCarousel';
import Button from '../components/Button';
import './HomePage.sass';
import game1 from '../assets/gameThumbnail/game1.png';
import game2 from '../assets/gameThumbnail/game2.png';
import game3 from '../assets/gameThumbnail/game3.png';
import game4 from '../assets/gameThumbnail/game4.png';
import User from '../assets/homeIcon/User.png';
import GoldMedal from '../assets/homeIcon/GoldMedal.png';
import Settings from '../assets/homeIcon/Settings.png';

import charImage1 from '../assets/character/mini.png';
import charImage2 from '../assets/character/middle.png';
import charImage3 from '../assets/character/adult.png';

const HomePage = () => {
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [characterImage, setCharacterImage] = useState(charImage1);
  const [characterName, setCharacterName] = useState('');
  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  // UserAPI로부터 레벨과 경험치 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserAPI().kidSearch(accessToken, kidId);
        setLevel(response.data.level);
        setExp(response.data.experience);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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

  const gameItems = [
    { type: 'game1', image: game1 },
    { type: 'game2', image: game2 },
    { type: 'game3', image: game3 },
    { type: 'game4', image: game4 },
  ];

  return (
    <div className="home-page">
      <section className="home-user">
        <div className="home-user__exp">
          {/* 경험치와 레벨 텍스트 */}
          <div className="home-user__exp--text">
            {characterName} 레벨 {level}, 경험치 {exp}%
          </div>

          {/* 경험치 바 */}
          <div className="home-user__exp--exp-wrap" style={{ width: `${exp}%` }} />
        </div>

        <div className="home-user__character">
          {/* 캐릭터 이미지 */}
          <img src={characterImage} alt="Character" className="home-user__character--image" />
        </div>
        <div className="home-user__sub-menu">
          <Link to={'/userpage'} className="home-user__sub-menu--button">
            <Button img={User} />
          </Link>
          <Link to={'/collection'} className="home-user__sub-menu--button">
            <Button img={GoldMedal} />
          </Link>
          <Link to={'/settings'} className="home-user__sub-menu--button">
            <Button img={Settings} />
          </Link>
        </div>
      </section>

      <section className="home-game">
        <EmblaCarousel slides={gameItems} options={{ axis: 'y', loop: true }} storageKey="homeGameIndex" />
      </section>
    </div>
  );
};

export default HomePage;
