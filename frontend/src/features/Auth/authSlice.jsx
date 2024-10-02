import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserAPI from '../../api/UserAPI';
import { saveTokenToCookie, getRefreshToken, removeRefreshToken } from '../../storage/Cookie';
import { useSelector } from 'react-redux';

// Action Part
// 쿠키 생성 및 저장
export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    // 로그인 API 호출
    const response = await UserAPI().login(email, password);
    if (response.status === 200) {
      // refresh 토큰은 쿠키에 저장, access토큰은 메모리에 저장
      saveTokenToCookie(response.data.refreshToken);
      return response.data.accessToken;
    } else {
      return rejectWithValue('로그인 실패');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '로그인 중 오류 발생');
  }
});

// 액세스 토큰 재발급
export const refreshAccessToken = createAsyncThunk('auth/refreshAccessToken', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return rejectWithValue('리프레시 토큰이 없습니다. 다시 로그인하세요.');
    } else {
      const accessToken = useSelector((state) => state.auth.accessToken);
      return response.data.accessToken; // access토큰 반환
    }
  } catch (error) {
    return rejectWithValue('액세스 토큰 재발급 중 오류 발생');
  }
});

// Reducer
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    error: null, // 에러 상태 추가
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      removeRefreshToken(); // 로그아웃 시 리프레시 토큰 삭제
    },
  },
  extraReducers: (builder) => {
    // login 액션 핸들링
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.error = null; // 성공 시 에러 초기화
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload; // 실패 시 에러 저장
      })
      // refreshAccessToken 액션 핸들링
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
