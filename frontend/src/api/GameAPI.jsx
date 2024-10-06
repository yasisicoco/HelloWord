import axios from 'axios';

const BASE_URL = 'https://j11b206.p.ssafy.io';

export const fetchGame2 = async (accessToken, kidId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/games/speech-cards?kidId=${kidId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.success && response.data.status === 200) {
      return response.data.data.rounds; // 성공적으로 데이터를 가져온 경우 rounds 반환
    } else {
      throw new Error('서버 응답이 올바르지 않습니다.');
    }
  } catch (err) {
    console.error('데이터 불러오기 실패:', err.message);
    throw err; // 호출한 쪽에서 에러를 처리하도록 재던짐
  }
};

export const fetchGame2Result = async (accessToken, gameResult) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/games/card-result`, gameResult, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.success && response.data.status === 200) {
      return response.data.data;
    } else {
      throw new Error('서버 응답이 올바르지 않습니다.');
    }
  } catch (err) {
    console.error('게임 결과 전송 실패:', err.message);
    throw err;
  }
};
