import axios from 'axios';

const BASE_URL = 'https://j11b206.p.ssafy.io';

const UserAPI = () => {
  // 유저 login
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

  // 유저 Access토큰 발급
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

  // 유저 아이디 중복 확인
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

  // 유저 회원가입
  const signUp = async (email, password, username, phone) => {
    const data = { email, password, username, phone };
    try {
      const response = await axios.post(`${BASE_URL}/signup`, data);

      if (response.data == '성공') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error UserAPI-signup');
      return true;
    }
  };

  return { login, getAccessToken, idDuplicate, signUp };
};

export default UserAPI;
