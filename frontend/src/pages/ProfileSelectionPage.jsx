import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './ProfileSelectionPage.sass';
import UserAPI from '../api/UserAPI';
import { setSelectedKid } from '../features/Auth/kidSlice';

const ProfileSelectionPage = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [kids, setKids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchKids = async () => {
    try {
      setIsLoading(true);
      const response = await UserAPI().getKids(accessToken);
      setKids(response.data);
    } catch (error) {
      console.error('아이 목록을 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchKids();
    }
  }, [accessToken]);

  const handleAddProfile = () => {
    navigate('/add-profile');
  };

  const handleSelectProfile = (kid) => {
    setSelectedProfile(kid.kidId === selectedProfile ? null : kid.kidId);
  };

  const handleSelectButtonClick = async () => {
    if (selectedProfile) {
      dispatch(setSelectedKid(selectedProfile));

      const kid = await UserAPI().kidSearch(accessToken, selectedProfile);
      if (kid.data.level) {
        navigate('/home');
      } else {
        navigate('/storypage');
      }
    }
  };

  return (
    <div className="profile-selection-container">
      <div className="header">
        <h1 className="header-title">아이 선택</h1>
        <button className="add-button" onClick={handleAddProfile}>
          +
        </button>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: '100%' }}></div>
      </div>

      {!isLoading && (
        <div className={`profile-grid ${kids.length === 0 ? 'no-profiles-grid' : ''}`}>
          {kids.length === 0 ? (
            <p className="no-profiles">아이 프로필을 생성해주세요.</p>
          ) : (
            kids.map(
              (
                kid,
              ) => (
                <div
                  key={kid.kidId}
                  className={`profile-item ${selectedProfile === kid.kidId ? 'selected' : ''}`}
                  onClick={() => handleSelectProfile(kid)}>
                  <img src={kid.profileImageUrl} alt={kid.name} className="profile-image" />
                  <p className="profile-name">{kid.name}</p>
                </div>
              ),
            )
          )}
        </div>
      )}

      <button
        className={`select-button ${selectedProfile ? '' : 'disabled'}`}
        disabled={!selectedProfile}
        onClick={handleSelectButtonClick}
      >
        선택
      </button>
    </div>
  );
};

export default ProfileSelectionPage;
