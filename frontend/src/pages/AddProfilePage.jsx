import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AddProfilePage.sass';
import UserAPI from '../api/UserAPI';
import Toast from '../components/Toast';
import { useToast } from '../context/ToastProvider';

import LandscapeModeWarning from '../features/Games/landscapeModeWarning';

const AddProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [yearError, setDateError] = useState('');
  const [gender, setGender] = useState('M');
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지 상태 추가
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const monthInputRef = useRef(null);
  const dayInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const { triggerToast } = useToast(); // useToast 훅 사용

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[1].toLowerCase();
      const allowedTypes = ['jpg', 'jpeg', 'png'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(fileType)) {
        setImageError('jpg, jpeg, png 형식의 파일만 업로드 가능합니다.');
        setProfileImage(null);
        setProfileImageFile(null);
        return;
      }

      if (file.size > maxFileSize) {
        setImageError('5MB 이하의 파일만 업로드 가능합니다.');
        setProfileImage(null);
        setProfileImageFile(null);
        return;
      }

      setImageError('');
      setProfileImage(URL.createObjectURL(file));
      setProfileImageFile(file);
    }
  };

  const handleNumberInput = (event, setFunction, length, nextRef = null) => {
    let value = event.target.value.replace(/[^0-9]/g, '');
    setFunction(value);
    if (value.length === length && nextRef) {
      nextRef.current.focus();
    }
  };

  const handleDateValidation = () => {
    if (year && month && day) {
      const numYear = parseInt(year, 10);
      const numMonth = parseInt(month, 10);
      const numDay = parseInt(day, 10);

      if (numYear < 1900 || numYear > currentYear || numMonth < 1 || numMonth > 12 || numDay < 1 || numDay > 31) {
        setDateError('잘못된 날짜입니다. 다시 입력해 주세요.');
        return;
      }

      const inputDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (inputDate > new Date()) {
        setDateError('잘못된 날짜입니다. 다시 입력해 주세요.');
      } else {
        setDateError('');
      }
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    if (event.target.value) {
      setNameError('');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // 이미 제출 중이면 중복 제출 방지

    if (!name) {
      setNameError('이름을 입력해주세요.');
      return;
    } else {
      setNameError('');
    }

    if (!year || !month || !day) {
      setDateError('생년월일을 입력해주세요.');
      return;
    } else {
      setDateError('');
    }

    handleDateValidation();

    if (yearError) return;

    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    setIsSubmitting(true); // 제출 중 상태로 변경
    try {
      await UserAPI().createKid(name, birthDate, profileImageFile, accessToken, gender);
      navigate('/select-kid');
      triggerToast('아이가 등록되었습니다.');
    } catch (error) {
      console.error('아이 등록 중 오류가 발생했습니다.', error);
      triggerToast('아이 등록이 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/select-kid');
  };

  return (
    <div className="add-profile-container">
      <LandscapeModeWarning />
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
          {imageError && <span className="error-message">{imageError}</span>}
        </div>

        <div className="input-section">
          <label htmlFor="name">이름</label>
          <div className="input-wrapper">
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="이름을 입력하세요"
              maxLength="10"
            />
            {nameError && <span className="error-message">{nameError}</span>}
          </div>
          <label htmlFor="birthDate">생년월일</label>
          <div className="birthdate-inputs">
            <div className="input-wrapper">
              <div className="input-box">
                <input
                  type="number"
                  placeholder="연도"
                  value={year}
                  ref={yearInputRef}
                  onChange={(e) => handleNumberInput(e, setYear, 4, monthInputRef)}
                  onBlur={handleDateValidation}
                  className="number-input"
                />
                <input
                  type="number"
                  placeholder="월"
                  value={month}
                  ref={monthInputRef}
                  onChange={(e) => handleNumberInput(e, setMonth, 2, dayInputRef)}
                  onBlur={handleDateValidation}
                  className="number-input"
                />
                <input
                  type="number"
                  placeholder="일"
                  value={day}
                  ref={dayInputRef}
                  onChange={(e) => handleNumberInput(e, setDay, 2)}
                  onBlur={handleDateValidation}
                  className="number-input"
                />
              </div>
              {yearError && <span className="error-message">{yearError}</span>}
            </div>
          </div>

          <label htmlFor="gender">성별</label>
          <div className="gender-toggle">
            <button className={`gender-button ${gender === 'M' ? 'selected' : ''}`} onClick={() => setGender('M')}>
              남자
            </button>
            <button className={`gender-button ${gender === 'F' ? 'selected' : ''}`} onClick={() => setGender('F')}>
              여자
            </button>
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
          등록
        </button>
      </div>
    </div>
  );
};

export default AddProfilePage;
