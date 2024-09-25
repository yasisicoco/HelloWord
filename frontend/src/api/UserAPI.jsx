import axios from 'axios';

const BASE_URL = 'https://j11b206.p.ssafy.io';

const UserAPI = () => {
  // login 로직
  const login = async (email, password) => {
    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/login`, // 요청을 보낼 경로
        // 요청에 보낼 데이터
        data,
      );

      return response.data;
    } catch (error) {
      console.log('Error UserAPI-login');
      return 'fail';
      // throw error;
    }
  };

  const getAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post(`${BASE_URL}/getaccessToken`, refreshToken);
      return response.data;
    } catch (error) {
      console.log('Error UserAPI-getAccessToken');
      return 'fail'; // 일단 fail로 지정
      // throw error;
    }
  };

  const idDuplicate = async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/checkId`, email);

      if (response.data == '정상') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error UserAPI-isDuplicate');
      return true;
      // return false;
    }
  };

  return { login, getAccessToken, idDuplicate };
};

export default UserAPI;
