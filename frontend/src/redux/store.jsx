// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 기본적으로 로컬 스토리지를 사용
import { combineReducers } from 'redux';

// 1. persist 설정을 위한 config 생성
const persistConfig = {
  key: 'token', // persist의 기준이 되는 key
  storage, // 로컬 스토리지 사용
  whitelist: ['auth'], // persist할 reducer를 지정 (auth만 저장)
};

// 2. combineReducers로 여러 리듀서를 결합
const rootReducer = combineReducers({
  auth: authReducer,
  // 다른 리듀서 추가 가능
});

// 3. persistReducer로 persist 기능을 rootReducer에 추가
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. 스토어 생성 (persistedReducer 사용) 및 미들웨어 설정
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // persist 관련 액션은 직렬화 경고에서 제외
      },
    }),
});

// 5. persistStore 생성 (스토어와 함께 동작)
export const persistor = persistStore(store);

// 6. store와 persistor를 export
export default store;
