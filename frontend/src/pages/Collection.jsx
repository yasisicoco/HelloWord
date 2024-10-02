import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Collection.sass';

const Collection = () => {
  const navigator = useNavigate();
  const percentage = 70;
  const items = Array.from({ length: 200 }, (_, i) => i + 1);

  return (
    <div className="collection-Page">
      <section className="collection-header">
        <button className="collection-header__backhome" onClick={() => navigator(-1)}>
          뒤로
        </button>
        <div className="collection-header__percentage">
          <div className="collection-header__percentage--bar">
            <div className="collection-header__percentage--bar--progress" style={{ width: `${percentage}%` }}></div>
            <div className="collection-header__percentage--text">{percentage}%</div>
          </div>
        </div>
        <div className="collection-header__pagename">도감</div>
      </section>

      <div className="collection-body">
        <section className="collection-body__items">
          {items.map((item) => (
            <div key={item} className="collection-body__items--item">
              {item}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Collection;
