import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // useSelector를 import
import './AddProfilePage.sass';
import UserAPI from '../api/UserAPI';

const AddProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null); // 파일을 별도로 저장
  const [imageError, setImageError] = useState(''); // 이미지 입력 오류 상태 추가
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(''); // 이름 입력 오류 상태 추가
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [yearError, setDateError] = useState(''); // 생년 오류 메시지 상태 추가
  const [gender, setGender] = useState('M'); // 성별을 저장하는 상태 추가 (M: 남자, F: 여자)
  const navigate = useNavigate();

  const accessToken = useSelector((state) => state.auth.accessToken); // Redux에서 accessToken 가져오기

  const monthInputRef = useRef(null);
  const dayInputRef = useRef(null);
  const yearInputRef = useRef(null);

  const currentYear = new Date().getFullYear();

  // 이미지 파일을 선택하고 미리보기 설정
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

      setImageError(''); // 유효한 파일일 경우 오류 메시지 제거
      setProfileImage(URL.createObjectURL(file));
      setProfileImageFile(file); // 파일을 저장
    }
  };

  const handleNumberInput = (event, setFunction, length, nextRef = null) => {
    let value = event.target.value.replace(/[^0-9]/g, ''); 
  
    // 유효한 숫자를 설정
    setFunction(value);
  
    // 입력이 완료되었을 때 다음 필드로 포커스를 이동
    if (value.length === length && nextRef) {
      nextRef.current.focus();
    }
  };
  
  const handleDateValidation = () => {
    if (year && month && day) {
      // 입력된 연도, 월, 일을 이용하여 날짜 유효성 체크
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
    
    if (yearError)
      return;
    
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
          <br/>
          {imageError && <span className="error-message">{imageError}</span>} {/* 이미지 오류 메시지 표시 */}
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
              maxLength="10" // 이름의 최대 길이를 10자로 제한
            />
            {nameError && <span className="error-message">{nameError}</span>} {/* 이름 오류 메시지 표시 */}
          </div>
          <label htmlFor="birthDate">생년월일</label>
          <div className="birthdate-inputs">
            <div className="input-wrapper">
              <input
                type="number"
                placeholder="연도"
                value={year}
                ref={yearInputRef}
                onChange={(e) => handleNumberInput(e, setYear, 4, monthInputRef)}
                onBlur={handleDateValidation} // 입력 필드를 벗어났을 때 전체 유효성 검사
                className="number-input"
              />
              {yearError && <span className="error-message">{yearError}</span>} {/* 연도 오류 메시지 표시 */}
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                placeholder="월"
                value={month}
                ref={monthInputRef}
                onChange={(e) => handleNumberInput(e, setMonth, 2, dayInputRef)}
                onBlur={handleDateValidation} // 입력 필드를 벗어났을 때 전체 유효성 검사
                className="number-input"
              />
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                placeholder="일"
                value={day}
                ref={dayInputRef}
                onChange={(e) => handleNumberInput(e, setDay, 2)}
                onBlur={handleDateValidation} // 입력 필드를 벗어났을 때 전체 유효성 검사
                className="number-input"
              />
            </div>
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
