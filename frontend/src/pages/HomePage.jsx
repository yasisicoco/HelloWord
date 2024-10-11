import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UserAPI from '../api/UserAPI';
import EmblaCarousel from '../components/EmblaCarousel';
import './HomePage.sass';
import game1 from '../assets/gameThumbnail/game1.png';
import game2 from '../assets/gameThumbnail/game2.png';
import game3 from '../assets/gameThumbnail/game3.png';
import game4 from '../assets/gameThumbnail/game4.png';
import User from '../assets/homeIcon/User.png';
import { clearTokens } from '../features/Auth/authSlice';

import charImage1 from '../assets/character/mini.gif';
import charImage2 from '../assets/character/middle.gif';
import charImage3 from '../assets/character/adult.gif';
import ConfirmationModal from '../components/ConfirmationModal';
import PortraitModeWarning from '../features/Games/portraitModeWarning';

import { MusicContext } from '../features/Games/musicProvider';

const HomePage = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [name, setName] = useState('');
  const [characterImage, setCharacterImage] = useState(charImage1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // 로그아웃 모달 상태 추가
  const drawerRef = useRef();
  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isPlaying, togglePlay } = useContext(MusicContext);

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

  // 메뉴 바깥을 클릭하면 드로어 닫기 (단, 모달이 열려있지 않을 때만)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isLogoutModalOpen && drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false); // 메뉴 바깥 클릭 시 닫기 (모달이 없을 때만)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLogoutModalOpen]); // 모달 상태가 바뀔 때마다 감시

  // 로그아웃 클릭 시 확인 모달 열기
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  // 로그아웃 확정 처리
  const handleLogoutConfirm = () => {
    dispatch(clearTokens());
    navigate('/');
  };

  // 로그아웃 취소 처리
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false); // 모달만 닫기
  };

  const gameItems = [
    { type: 'game1', image: game1 },
    { type: 'game2', image: game2 },
    { type: 'game3', image: game3 },
    { type: 'game4', image: game4 },
  ];

  return (
    <div className="home-page">
      <PortraitModeWarning />

      <section className="home-user">
        <div className="setting-box">
          <div className="user-button" onClick={toggleDrawer}>
            <img src={User} alt="User Icon" />
          </div>
          <button className="music-button" onClick={togglePlay}>
            {isPlaying ? '■' : '▶'}
          </button>
        </div>

        {drawerOpen && <div className="overlay" onClick={() => setDrawerOpen(false)}></div>}

        <div className={`drawer-menu ${drawerOpen ? 'open' : ''}`} ref={drawerRef}>
          <div className="drawer-header">
            <h2>메뉴</h2>
            <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
              x
            </button>
          </div>
          <div className="drawer-links">
            <Link to="/profile">아이 통계</Link>
            <Link to="/collection">학습 단어</Link>
            <Link to="/select-kid">아이 변경</Link>
            <div onClick={handleLogoutClick}>로그아웃</div> {/* 로그아웃 버튼 클릭 시 모달 열기 */}
          </div>
        </div>

        <div className="home-user__character">
          <img src={characterImage} alt="Character" className="home-user__character--image" />
        </div>
        <div className="home-user__exp">
          <div className="home-user__exp--text">
            LV{level} 경험치 {exp}%
          </div>
          <div className="home-user__exp--exp-wrap" style={{ width: `${exp}%` }} />
        </div>
      </section>

      <section className="home-game">
        <EmblaCarousel slides={gameItems} options={{ axis: 'y', loop: true }} storageKey="homeGameIndex" />
      </section>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        message="로그아웃하시겠습니까?"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
};

export default HomePage;
