import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Collection.sass';
import { useSelector } from 'react-redux';
import axios from 'axios';

import PortraitModeWarning from '../features/Games/portraitModeWarning';

const BASE_URL = 'https://j11b206.p.ssafy.io';

const Collection = () => {
  const navigator = useNavigate();
  const kidId = useSelector((state) => state.kid.selectedKidId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [collections, setCollections] = useState([]);
  const [collectionRate, setCollectionRate] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [allCount, setAllCount] = useState(0);

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

          // 데이터를 하나의 배열에 모두 저장
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

  return (
    <div className="collection-Page">
      <PortraitModeWarning />

      <section className="collection-header">
        <button className="collection-header__backhome" onClick={() => navigator(-1)}>
          뒤로
        </button>
        <div className="collection-header__percentage">
          <div className="collection-header__percentage--bar">
            <div className="collection-header__percentage--bar--progress" style={{ width: `${collectionRate}%` }}></div>
            <div className="collection-header__percentage--text">{collectionRate}%</div>
          </div>
        </div>
        <div className="collection-header__info">
          {completedCount} / {allCount} 개 수집 완료
        </div>
      </section>

      <div className="collection-body">
        <section className="collection-body__items">
          {/* 모든 데이터를 하나의 리스트로 보여줍니다 */}
          {collections.map((item) => (
            <div
              key={item.wordId}
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
    </div>
  );
};

export default Collection;
