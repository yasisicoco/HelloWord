import { useSelector, useDispatch } from 'react-redux';
import { refreshAccessToken } from '../Auth/authSlice';

// accessToken 가져오기
export const selectAccessToken = (state) => state.auth.accessToken;

// accessToken이 유효한지 확인하는 함수
export const isAccessTokenValid = (accessToken) => {
  if (!accessToken) return false;

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
    return decoded.exp > currentTime; // 만료 시간이 현재 시간보다 크면 유효
  } catch (error) {
    // return false; // 토큰 디코딩 오류 발생 시 유효하지 않음
    return true; // 일단 api가 다 되지 않았으니 일단 true로 반환할것
  }
};

// accessToken을 통한 인증 로직
// access 토큰을 반환하거나 false 값만 반환할거임
export const useAuth = async () => {
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();

  if (!accessToken || !isAccessTokenValid(accessToken)) {
    // accessToken이 없거나 유효하지 않은 경우, refreshToken을 사용하여 새로 발급받기
    const result = dispatch(refreshAccessToken());
    return result; // access토큰이 되거나 혹은 false로 반환될거임
  }

  return false; // 이상이 없음으로 access토큰만 반환될거임
};
