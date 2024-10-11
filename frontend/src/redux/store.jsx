// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 기본적으로 localStorage를 사용
import { combineReducers } from 'redux';
import authReducer from '../features/Auth/authSlice'; // authSlice에서 가져옴
import kidReducer from '../features/Auth/kidSlice'; // authSlice에서 가져옴
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// persist 설정
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'kid'], // auth 리듀서만 저장 (다른 리듀서를 추가하고 싶다면 이곳에 추가)
};

// 여러 리듀서를 병합 (추가적인 리듀서가 있을 경우)
const rootReducer = combineReducers({
  auth: authReducer,
  kid: kidReducer,
});

// persistReducer를 사용하여 rootReducer를 래핑
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// persistor 생성 (persistor는 앱에서 사용하여 persist된 상태를 제어)
export const persistor = persistStore(store);

export default store;
