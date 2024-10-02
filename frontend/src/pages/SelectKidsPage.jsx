import './SelectKids.sass';
import { FaCirclePlus } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildModal from '../components/ChildModal';

const SelectKidsPage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // 다른 작업하기
  };

  useEffect(() => {}, [isModalOpen]);

  return (
    <div>
      <div className={`selectkids-Page ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="selectkids-form">
          {/* 상단 확인 문구 및 아이 추가 아이콘 추가하기 */}
          <section className="selectkids-form__top">
            <div className="selectkids-form__top--word">
              <p>학습할 아이를 선택해주세요.</p>
            </div>
            <div className="selectkids-form__top--add">
              <FaCirclePlus onClick={openModal} />
            </div>
          </section>
          {/* 아이 추가 될 때마다 아이 Card 추가할 것 */}
          <section className="selectkids-form__childlist">
            <div>학습할 아이가 없습니다. 계정을 등록해주세요!</div>
          </section>
          {/* 시작하기 버튼 만들기 */}
          <section className="selectkids-form__startbutton">
            <button className="selectkids-form__startbutton--button" onClick={() => navigate('/storypage')}>
              시작하기
            </button>
          </section>
        </div>
      </div>
      {/* 모달 위치 */}
      <ChildModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default SelectKidsPage;
