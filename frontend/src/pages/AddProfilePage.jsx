import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // useSelector를 import
import './AddProfilePage.sass';
import UserAPI from '../api/UserAPI';

const AddProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null); // 파일을 별도로 저장
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [gender, setGender] = useState('M'); // 성별을 저장하는 상태 추가 (M: 남자, F: 여자)
  const navigate = useNavigate();

  const accessToken = useSelector((state) => state.auth.accessToken); // Redux에서 accessToken 가져오기

  const monthInputRef = useRef(null);
  const dayInputRef = useRef(null);

  // 이미지 파일을 선택하고 미리보기 설정
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setProfileImageFile(file); // 파일을 저장
    }
  };

  const handleNumberInput = (event, setFunction, length, nextRef = null) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); 
    setFunction(value);
    if (value.length === length && nextRef) {
      nextRef.current.focus();
    }
  };

  const handleSubmit = async () => {
    if (!name || !year || !month || !day || !gender) {
      alert('이름, 생년월일 및 성별을 모두 입력하세요.');
      return;
    }

    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    try {
      // createKid API 호출
      await UserAPI().createKid(name, birthDate, profileImageFile, accessToken, gender);
      alert('아이 등록이 완료되었습니다!');
      navigate('/select-kid'); // 프로필 선택 페이지로 이동
    } catch (error) {
      console.error('아이 등록 중 오류가 발생했습니다.', error);
      alert('아이 등록에 실패했습니다.');
    }
  };

  const handleBack = () => {
    navigate('/select-kid');
  };

  return (
    <div className="add-profile-container">
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          <span className="back-icon">&lt;</span>
        </button>
        <h1 className="header-title">아이 등록</h1>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: '100%' }}></div>
      </div>

      <div className="content">
        <div className="profile-image-section">
          <label htmlFor="profileImage" className="profile-image-label">
            {profileImage ? (
              <img src={profileImage} alt="프로필" className="profile-image-preview" />
            ) : (
              <div className="profile-image-placeholder">사진 추가</div>
            )}
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="input-section">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />

          <label htmlFor="birthDate">생년월일</label>
          <div className="birthdate-inputs">
            <input
              type="tel"
              placeholder="연도"
              value={year}
              onChange={(e) => handleNumberInput(e, setYear, 4, monthInputRef)} // 4자리 입력 시 월 필드로 이동
              className="number-input"
              maxLength="4"
            />
            <input
              type="tel"
              placeholder="월"
              value={month}
              ref={monthInputRef}
              onChange={(e) => handleNumberInput(e, setMonth, 2, dayInputRef)} // 2자리 입력 시 일 필드로 이동
              className="number-input"
              maxLength="2"
            />
            <input
              type="tel"
              placeholder="일"
              value={day}
              ref={dayInputRef}
              onChange={(e) => handleNumberInput(e, setDay, 2)}
              className="number-input"
              maxLength="2"
            />
          </div>

          {/* 성별 선택 버튼 추가 */}
          <label htmlFor="gender">성별</label>
          <div className="gender-toggle">
            <button
              className={`gender-button ${gender === 'M' ? 'selected' : ''}`}
              onClick={() => setGender('M')}
            >
              남자
            </button>
            <button
              className={`gender-button ${gender === 'F' ? 'selected' : ''}`}
              onClick={() => setGender('F')}
            >
              여자
            </button>
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </div>
  );
};

export default AddProfilePage;
