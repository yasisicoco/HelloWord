import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // useDispatch 추가
import './ProfileSelectionPage.sass';
import UserAPI from '../api/UserAPI'; // UserAPI를 import
import { setSelectedKid } from '../features/Auth/kidSlice'; // 아이 선택 액션

const ProfileSelectionPage = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [kids, setKids] = useState([]); // 아이 목록 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [selectedProfile, setSelectedProfile] = useState(null); // 선택된 프로필 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  const dispatch = useDispatch(); // Redux 액션을 디스패치 하기 위한 훅

  // 아이 목록을 가져오는 함수
  const fetchKids = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const response = await UserAPI().getKids(accessToken);
      setKids(response.data); // 아이 목록 상태 업데이트
      console.log(response.data);
    } catch (error) {
      console.error('아이 목록을 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 페이지가 로드되거나 accessToken이 변경될 때마다 아이 목록을 가져옴
  useEffect(() => {
    if (accessToken) {
      fetchKids();
    }
  }, [accessToken]);

  // 프로필 추가 버튼 클릭 핸들러
  const handleAddProfile = () => {
    navigate('/add-profile');
  };

  // 프로필 선택 핸들러
  const handleSelectProfile = (kid) => {
    setSelectedProfile(kid.kidId === selectedProfile ? null : kid.kidId);
  };

  // 선택 버튼 클릭 시 호출되는 함수
  const handleSelectButtonClick = () => {
    if (selectedProfile) {
      // Redux에 선택된 아이 ID 저장
      dispatch(setSelectedKid(selectedProfile));

      // '/home' 경로로 이동
      navigate('/home');
    }
  };

  return (
    <div className="profile-selection-container">
      <div className="header">
        <h1 className="header-title">아이 선택</h1>
        <button className="add-button" onClick={handleAddProfile}>+</button>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: "100%" }}></div>
      </div>

      {isLoading ? ( // 로딩 중일 때 로딩 메시지 표시
        <p>아이 목록을 불러오는 중입니다...</p>
      ) : (
        <div className={`profile-grid ${kids.length === 0 ? 'no-profiles-grid' : ''}`}>
          {kids.length === 0 ? ( // 아이 목록이 없을 때 메시지 표시
            <p className="no-profiles">아이 프로필을 생성해주세요.</p>
          ) : (
            kids.map((kid) => ( // 아이 목록을 렌더링
              <div
                key={kid.kidId}
                className={`profile-item ${selectedProfile === kid.kidId ? 'selected' : ''}`}
                onClick={() => handleSelectProfile(kid)}
              >
                <img src={kid.profileImageUrl} alt={kid.name} className="profile-image" />
                <p className="profile-name">{kid.name}</p>
              </div>
            ))
          )}
        </div>
      )}

      <button
        className={`select-button ${selectedProfile ? '' : 'disabled'}`}
        disabled={!selectedProfile}
        onClick={handleSelectButtonClick} // 선택 버튼 클릭 시 호출
      >
        선택
      </button>
    </div>
  );
};

export default ProfileSelectionPage;
