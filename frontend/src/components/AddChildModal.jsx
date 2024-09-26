import './AddChildModal.sass';
import { IoClose } from 'react-icons/io5';

function AddChildModal({ isOpen, closeModal }) {
  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="addchild-compo">
        <div className="addchild-compo__title">
          <IoClose className="addchild-compo__close" onClick={closeModal} />
          <p>아이등록</p>
        </div>

        <div className="addchild-compo__profileimg">
          <p>프로필 이미지</p>
        </div>
        <div className="addchild-compo__nameinput">
          <p>이름</p>
          <input></input>
        </div>
        <div className="addchild-compo__ageinput">
          <p>나이</p>
          <input></input>
        </div>
        <div className="addchild-compo__button">
          <button className="addchild-compo__button--submit" onClick={closeModal}>
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddChildModal;
