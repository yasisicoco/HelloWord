import Cookies from 'js-cookie';

export const saveTokenToCookie = (tokenData) => {
  // 토큰을 쿠키에 저장
  Cookies.set('refreshToken', tokenData, {
    expires: 7, // 7일 동안 유효 -> 유통기한 다되면 undefined로 나옴
    secure: true,
    sameSite: 'Strict',
    path: '/',
  });
};

// access 토큰을 재발급받을 때 사용할 리프레시 토큰
export const getRefreshToken = () => {
  return Cookies.get('refreshToken');
};

// 로그아웃할 때 리프레시 토큰 삭제
export const removeRefreshToken = () => {
  Cookies.remove('refreshToken');
  return true;
};
