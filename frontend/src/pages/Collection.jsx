import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Collection.sass';
import { useSelector } from 'react-redux';
import axios from 'axios';

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
          const data = response.data;
          setCollections(data.collections);
          setCollectionRate(data.collection_rate);
          setCompletedCount(data.completed_count);
          setAllCount(data.all_count);
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error.message);
      }
    };

    fetchCollectionList();
  }, [kidId, accessToken]);

  return (
    <div className="collection-Page">
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
          {collections.map((item) => (
            <div key={item.wordId} className="collection-body__items--item">
              <img
                src={item.isComleted ? item.image_url : 'path/to/gray-image.png'}
                alt={item.word}
                className="collection-item-image"
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
