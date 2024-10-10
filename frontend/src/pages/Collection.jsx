import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Collection.sass';
import { useSelector } from 'react-redux';
import axios from 'axios';

import PortraitModeWarning from '../features/Games/portraitModeWarning';

const BASE_URL = 'https://j11b206.p.ssafy.io';

const Collection = () => {
  const navigate = useNavigate();
  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [collections, setCollections] = useState([]);
  const [collectionRate, setCollectionRate] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [allCount, setAllCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부

  useEffect(() => {
    const fetchCollectionList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/collections?kidId=${kidId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          const collectionlist = response.data.data;

          setCollections(collectionlist.collections);
          setCollectionRate(collectionlist.collectionRate);
          setCompletedCount(collectionlist.completedCount);
          setAllCount(collectionlist.allCount);
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error.message);
      }
    };

    fetchCollectionList();
  }, [kidId, accessToken]);

  const handleItemClick = (item) => {
    if (item.isCompleted) {
      setSelectedItem(item); // 선택된 아이템 설정
      setIsModalOpen(true); // 모달 열기
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="collection-Page">
      <PortraitModeWarning />

      <section className="collection-header">
        <button className="collection-header__backhome" onClick={() => navigate(-1)}>
          뒤로
        </button>
        <div className="collection-header__percentage">
          <div className="collection-header__percentage--bar">
            <div className="collection-header__percentage--bar--progress" style={{ width: `${collectionRate}%` }}></div>
            <div className="collection-header__percentage--text">{collectionRate}%</div>
          </div>
          <div className="collection-header__info">
            {completedCount} / {allCount} 개 수집 완료
          </div>
        </div>
      </section>

      <div className="collection-body">
        <section className="collection-body__items">
          {collections.map((item) => (
            <div
              key={item.wordId}
              onClick={() => handleItemClick(item)} // 클릭 이벤트 추가
              className={`collection-body__items--item ${item.isCompleted ? 'completed' : 'not-completed'}`}>
              <img
                src={item.imageUrl}
                alt={item.word}
                className={`collection-item-image ${item.isCompleted ? '' : 'grayscale'}`}
              />
              <div className="collection-item-word">{item.word}</div>
            </div>
          ))}
        </section>
      </div>

      {/* 모달을 JSX 내에서 직접 구현 */}
      {isModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <img src={selectedItem.imageUrl} alt={selectedItem.word} className="modal-image" />
            <div className="modal-info">
              <h2>{selectedItem.word}</h2>
              <p>등록 날짜: {selectedItem.completionDate ? new Date(selectedItem.completionDate).toLocaleDateString() : 'N/A'}</p>
              <p>맞춘 횟수: {selectedItem.count}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
