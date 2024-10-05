import './ChildModal.sass';
import { IoClose } from 'react-icons/io5';
import { useState, useRef, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import UserAPI from '../api/UserAPI';
import { useSelector } from 'react-redux';

function AddChildModal({ isOpen, closeModal }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(null); // Date 객체 유지
  const [profileimg, setProfileimg] = useState('../character/defaultProfile.png');
  const fileInputRef = useRef(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [allCheck, setCheck] = useState(false);
  const [isbutton, setButton] = useState(false);

  useEffect(() => {
    setCheck(birthDate && name);
  }, [birthDate, name]);

  useEffect(() => {
    setButton(allCheck);
  }, [allCheck]);

  // DatePicker에서 선택한 날짜를 Date 객체로 유지
  const handleDateChange = (date) => {
    setBirthDate(date); // Date 객체로 저장
  };

  // 아이 생성 제출
  const submitProfile = async (e) => {
    e.preventDefault();

    const formattedDate = birthDate ? format(birthDate, 'yyyy-MM-dd') : '';

    // 파일 가져오기
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('프로필 이미지를 선택해 주세요.');
      return;
    }

    try {
      // API 호출
      const response = await UserAPI().createKid(name, formattedDate, file, accessToken);

      // 아이가 성공적으로 추가된 경우, 모달 닫기 + 부모 컴포넌트에 갱신 트리거
      closeModal(true); // 부모 컴포넌트에서 아이 목록을 갱신하도록 true로 전달

      // 제출 후 상태 초기화
      setName('');
      setBirthDate(null);
      setProfileimg('../character/defaultProfile.png');
    } catch (error) {
      console.error('아이 추가 실패', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileimg(URL.createObjectURL(file)); // 미리보기 이미지 설정
      // 파일은 fileInputRef로 유지되어 submitProfile에서 사용됨
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const resetData = () => {
    setName('');
    setBirthDate(null);
    setProfileimg('../character/defaultProfile.png');
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <form onSubmit={submitProfile} className="addchild-compo">
        <div className="addchild-compo__title">
          <IoClose
            className="addchild-compo__close"
            onClick={() => {
              closeModal();
              resetData();
            }}
          />
          <p>아이등록</p>
        </div>

        <div className="addchild-compo__profileimg">
          <div className="addchild-compo__profileimg--imgBox">
            <img
              onClick={handleImageClick}
              src={profileimg}
              alt="Profile"
              className="addchild-compo__profileimg--imgBox--img"
            />
          </div>
          <button type="button" className="addchild-compo__profileimg--imgBox--imgButton" onClick={handleImageClick}>
            <FaPen />
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>

        <div className="addchild-compo__nameinput">
          <p>이름</p>
          <input
            className="addchild-compo__nameinput--nameBox"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="addchild-compo__ageinput">
          <p>생년월일</p>
          <DatePicker
            locale={ko} // 한국어 로케일 설정
            selected={birthDate} // Date 객체를 전달
            onChange={handleDateChange} // Date 객체로 설정
            dateFormat="yyyy/MM/dd"
            placeholderText="생년월일을 선택하세요"
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            className="addchild-compo__ageinput--ageBox"
          />
        </div>

        <div className="addchild-compo__button">
          <button
            type="submit"
            className={`${isbutton ? 'addchild-compo__button--submitO' : 'addchild-compo__button--submitX'}`}
            disabled={!isbutton}>
            추가하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddChildModal;
