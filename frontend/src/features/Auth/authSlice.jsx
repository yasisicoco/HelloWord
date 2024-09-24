import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserAPI from '../../api/UserAPI';
import { saveTokenToCookie, getRefreshToken, removeRefreshToken } from '../../storage/Cookie';

// action 과 reducer를 하나로 합침

// Action Part
// 쿠키 생성 및 저장
export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  // 여기서 엑세스토큰하고 리프레시 토큰을 받아올거임
  const response = await UserAPI().login(email, password);

  // refresh 토큰은 쿠키에 저장, access토큰은 메모리에 저장
  saveTokenToCookie('refreshToken');
  setAccessToken('accessToken');

  return 'accessToken'; // 이거 나중에 변수로 바꿔줘야 함
  // 여기서 만약에 에러가 난다면 밖에서 에러여부를 확인하고 갈 수 있게 해줘야함
});

export const refreshAccessToken = createAsyncThunk('auth/refreshAccessToken', async (_, { result }) => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  } else {
    // 만약 리프레시 토큰이 살아있다면 다시 access 토큰을 불러옴
    const response = await UserAPI().getAccessToken(refreshToken);
    setAccessToken('accessToken'); // access 토큰을 다시 저장
    return 'accessToken'; // access토큰 반환
  }
});

// Reducer
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;
