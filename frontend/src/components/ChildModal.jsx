import './ChildModal.sass';
import { IoClose } from 'react-icons/io5';
import { useState, useRef, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function AddChildModal({ isOpen, closeModal }) {
  const [name, SetName] = useState('');
  const [birthDate, setBirthDate] = useState(null); // Date 객체 유지
  const [profileimg, setProfileimg] = useState('../charactor/defaultProfile.png');
  const fileInputRef = useRef(null);

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

  const submitProfile = async (e) => {
    e.preventDefault();
    // 제출 시 포맷팅하여 처리
    const formattedDate = birthDate ? format(birthDate, 'yyyy-MM-dd') : '';
    console.log(name);
    console.log(formattedDate);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileimg(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const resetData = () => {
    SetName('');
    setBirthDate(null);
    setProfileimg('../charactor/defaultProfile.png');
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
          <input className="addchild-compo__nameinput--nameBox" onChange={(e) => SetName(e.target.value)} />
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
            className={`${isbutton ? 'addchild-compo__button--submitO' : 'addchild-compo__button--submitX'}`}
            onClick={() => {
              closeModal();
              resetData();
            }}
            disabled={!isbutton}>
            추가하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddChildModal;
