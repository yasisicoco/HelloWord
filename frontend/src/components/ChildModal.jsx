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
  const [birthDate, setBirthDate] = useState(null);
  const [profileimg, setProfileimg] = useState('../charactor/defaultProfile.png');
  const fileInputRef = useRef(null);

  const [allCheck, setCheck] = useState(false);
  const [isbutton, setButton] = useState(false);

  useEffect(() => {
    if (birthDate && name) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [birthDate, name]);

  useEffect(() => {
    if (allCheck) {
      setButton(true);
    } else {
      setButton(false);
    }
  }, [allCheck]);

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setBirthDate(formattedDate);
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    console.log(name);
    console.log(birthDate);
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

  // 달력 커스텀
  const YEARS = Array.from({ length: new Date().getFullYear() + 1 - 2000 }, (_, i) => new Date().getFullYear() - i);
  const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const changeOfDay = (nameOfDay) => {
    const KORDay = {
      Sunday: '일',
      Monday: '월',
      Tuesday: '화',
      Wednesday: '수',
      Thursday: '목',
      Friday: '금',
      Saturday: '토',
    };
    return KORDay[nameOfDay];
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
            formatWeekDay={(nameOfDay) => changeOfDay(nameOfDay)}
            selected={birthDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            placeholderText="생년월일을 선택하세요"
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            scrollableYearDropdown
            dropdownMode="select"
            onFocus
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
