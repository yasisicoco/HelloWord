// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';
import { persistStore, persistReducer } from 'redux-persist';

// // persist 설정
// const persistConfig = {
//   key: 'root', // localStorage에 저장될 key
//   storage, // localStorage 사용
//   whitelist: ['auth'], // auth 리듀서만 persist 처리
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//   },
// });

const store = configureStore({
  reducer: {
    auth: authReducer,
    // 다른 리듀서 추가
  },
});

export default store;
