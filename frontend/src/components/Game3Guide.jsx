import Modal from 'react-modal';
import timebarGuide from '../assets/guide/timebarGuide.png';
import game3Guide from '../assets/guide/game3Guide.png';

import './Game1Guide.sass';

Modal.setAppElement('#root');

const Game2Guide = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      style={{
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '96%',
          padding: '20px',
          borderRadius: '24px',
          border: '1px solid #ccc',
          background: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',
        },
      }}>
      {/* 닫기 버튼 */}
      <button
        onClick={onRequestClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '30px',
          cursor: 'pointer',
        }}>
        &times;
      </button>

      <div className="GuideModal-page">
        {/* 게임 타이틀을 동적으로 출력 */}
        <section className="GuideModal-page__section">
          <p className="GuideModal-page__title">단어 말하기</p>
        </section>

        <section className="GuideModal-page__section">
          <p className="GuideModal-page__section--header">- 타임바</p>
          <p className="GuideModal-page__section--text">
            1. 뒤로가기 버튼 : 뒤로가기를 누르면 이전 화면으로 돌아갑니다.
          </p>
          <p className="GuideModal-page__section--text">
            2. 타임바 : 문제 푸는 시간이 표시됩니다. 빨리 답을 선택하세요!
          </p>
          <p className="GuideModal-page__section--text">3. 라운드 : 현재 몇 번째 라운드인지 보여줍니다.</p>
          <img
            src={timebarGuide}
            alt="뒤로가기"
            className="GuideModal-page__image"
            style={{ width: 'auto', height: '10%' }}
          />
        </section>

        <section className="GuideModal-page__section">
          <p className="GuideModal-page__section--header">- 짝 맞추기</p>
          <p className="GuideModal-page__section--text">4. 서로 짝이 맞는 단어와 그림을 고르세요</p>
          <p className="GuideModal-page__section--text">››› 카드를 선택하면 초록색으로 바뀌어요!</p>
          <img
            src={game3Guide}
            alt="게임 설명"
            className="GuideModal-page__image"
            style={{ width: 'auto', height: '10%' }}
          />
        </section>
      </div>
    </Modal>
  );
};

export default Game2Guide;
