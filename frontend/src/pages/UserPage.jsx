import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAPI from '../api/UserAPI';
import LearningMount from '../components/LearningMount';
import GameMount from '../components/GameMount';
import { TiArrowBack } from 'react-icons/ti';
import './UserPage.sass';
import { useSelector } from 'react-redux';
import PortraitModeWarning from '../features/Games/portraitModeWarning';

const UserPage = () => {
  const [active, setActive] = useState('learning');
  const [kidData, setKidData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const nav = useNavigate();
  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const kid = await UserAPI()
          .kidSearch(accessToken, kidId)
          .then((response) => response.data);
        const learningStats = await UserAPI()
          .getLearningStats(accessToken, kidId)
          .then((response) => response.data);
        const gameStats = await UserAPI()
          .getGameStats(accessToken, kidId)
          .then((response) => response.data);

        setKidData({
          ...kid,
          ...learningStats,
          ...gameStats,
        });

        console.log(gameStats);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [accessToken, kidId]);

  // 아이 삭제를 위한 함수
  const deleteKid = async () => {
    try {
      await UserAPI().deleteKid(accessToken, kidId);
      nav('/select-kid'); // 삭제 후 이전 페이지로 이동
    } catch (error) {
      console.error('Error deleting kid:', error);
    }
  };

  // 모달 표시 처리
  const handleDeleteClick = () => {
    setShowModal(true);
  };

  // 모달에서 '예'를 클릭 시 삭제 수행
  const handleConfirmDelete = () => {
    deleteKid();
    setShowModal(false); // 모달 닫기
  };

  // 모달에서 '아니오'를 클릭 시 모달 닫기
  const handleCancelDelete = () => {
    setShowModal(false);
  };

  return (
    <div className="user-page">
      <PortraitModeWarning />

      <section className="top-nav">
        <div className="top-nav__back-space">
          <TiArrowBack onClick={() => nav(-1)} />
          <div onClick={handleDeleteClick}>아이 삭제</div> {/* 아이 삭제 클릭 시 모달 표시 */}
        </div>
        <div className="top-nav__middle-container">
          <button
            onClick={() => setActive('learning')}
            className={`top-nav__middle-container--study-button ${active === 'learning' ? 'active-tab' : ''}`}>
            학습량
          </button>
          <button
            onClick={() => setActive('statics')}
            className={`top-nav__middle-container--status ${active === 'statics' ? 'active-tab' : ''}`}>
            통계
          </button>
        </div>
      </section>
      <section className="main-content">
        {active === 'learning' && kidData && <LearningMount kidData={kidData} />} {/* kidData를 props로 전달 */}
        {active === 'statics' && <GameMount kidData={kidData} />}
      </section>

      {/* 모달 표시 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>아이 프로필을 삭제하시겠습니까?</h2>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>예</button>
              <button onClick={handleCancelDelete}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
