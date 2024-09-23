import React from 'react';
import axios from 'axios';

const BASE_URL = '';

const UserAPI = () => {
  const login = async (userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/signup`, // 요청을 보낼 경로
        userData, // 요청에 보낼 데이터
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error during sign-up:', error.response?.data || error.message); // 에러 처리
      throw error; // 필요하면 에러를 호출한 쪽에서 처리하게 할 수 있습니다.
    }
  };

  return { login };
};

export default UserAPI;
