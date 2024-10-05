import './SelectKids.sass';
import { FaCirclePlus } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildModal from '../components/ChildModal';
import UserAPI from '../api/UserAPI';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedKid } from '../features/Auth/kidSlice'; // 아이 선택 액션

const SelectKidsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector((state) => state.auth.accessToken);
  const selectedKidFromRedux = useSelector((state) => state.kid.selectedKidId); // 선택된 아이 ID 확인

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState(null); // 선택된 아이 ID 상태
  const [kids, setKids] = useState([]); // 아이 목록을 상태로 관리
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // 아이 목록을 가져오는 함수
  const fetchKids = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const listKids = await UserAPI().getKids(accessToken);
      setKids(listKids.data); // 아이 목록 상태 업데이트
      console.log(listKids);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = (shouldRefresh = false) => {
    setIsModalOpen(false);
    if (shouldRefresh) {
      fetchKids(); // 모달이 닫히면서 목록을 갱신
    }
  };

  useEffect(() => {
    fetchKids(); // 페이지가 로드되거나 accessToken이 변경될 때마다 아이 목록을 가져옴
  }, [isModalOpen, accessToken]);

  const handleCardClick = (kidId) => {
    setSelectedKidId(kidId); // 선택된 아이 ID를 상태에 저장
  };

  const handleStartClick = () => {
    if (selectedKidId) {
      dispatch(setSelectedKid(selectedKidId)); // Redux에 선택된 아이 ID 저장
      navigate('/home');
    } else {
      alert('학습할 아이를 선택해주세요.');
    }
  };

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

          {/* 아이 목록 표시 및 로딩 스피너 */}
          <section className="kid-card__childlist">
            {isLoading ? (
              <div>로딩 중...</div> // 로딩 중일 때 표시할 내용
            ) : kids.length > 0 ? (
              kids.map((kid) => (
                <div
                  key={kid.kidId}
                  className={`kid-card ${selectedKidId === kid.kidId ? 'kid-card__childlist--selected' : ''}`} // 선택된 카드에 스타일 적용
                  onClick={() => handleCardClick(kid.kidId)}>
                  <img className="kid-card__childlist--img" src={kid.profileImageUrl} alt={`${kid.name}'s profile`} />
                  <div className="kid-card__childlist--selected--kidinfo">
                    <p className="kid-card__childlist--selected--p">{kid.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <div>학습할 아이가 없습니다. 계정을 등록해주세요!</div>
            )}
          </section>

          {/* 시작하기 버튼 만들기 */}
          <section className="selectkids-form__startbutton">
            <button className="selectkids-form__startbutton--button" onClick={handleStartClick}>
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
