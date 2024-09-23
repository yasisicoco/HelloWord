import { Cookies } from 'react-cookie';

const cookies = new Cookies();

// 새로운 리프레시 토큰을 저장하기 위한 함수
export const setRefreshToken = (refreshToken) => {
  const today = new Date();
  const expireDate = today.setDate(today.getDate() + 7);

  return cookies.set('refresh_token', refreshToken, {
    sameSite: 'strict',
    path: '/',
    expires: expireDate,
  });
};

// 쿠키에 저장된 리프레시 토큰을 가지고 오기위한 함수
export const getCookieToken = () => {
  return cookies.get('refresh_token');
};

// 쿠키에 저장된 토큰을 삭제하기 위한 함수 (로그아웃 시 사용)
export const removeCookieToken = () => {
  return cookies.remove('refresh_token', { sameSite: 'strict', path: '/' });
};
