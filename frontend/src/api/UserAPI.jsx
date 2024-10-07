import axios from 'axios';

const BASE_URL = 'https://j11b206.p.ssafy.io';

const UserAPI = () => {
  // 유저 login
  const login = async (email, password) => {
    const data = { email: email, password: password };
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status != 200) {
        console.log(`login Server Error: ${response}`);
        return response;
      }

      return response.data;
    } catch (error) {
      console.log('Error UserAPI-login: 유저 정보가 존재하지 않거나 서버 에러');
      throw error;
    }
  };

  // 유저 아이디 중복 확인
  const idDuplicate = async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/check-duplicate/email?email=${email}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status != 200) {
        console.log(`isDuplicate Server Error: ${response}`);
        return true;
      }

      return response.data.data;
    } catch (error) {
      console.log('Error UserAPI-isDuplicate');
      throw error;
    }
  };

  // 유저 회원가입
  const signUp = async (email, password, username, phone) => {
    const data = { email: email, password: password, username: username, phone: phone };
    try {
      const response = await axios.post(`${BASE_URL}/api/users`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status != 200) {
        console.log(`signUp Server Error: ${response}`);
        return false;
      }

      return true;
    } catch (error) {
      console.log('Error UserAPI-signup');
      throw error;
    }
  };

  const createKid = async (name, birthDate, profileImageFile, accessToken) => {
    const formData = new FormData();

    // kid 객체를 JSON으로 구성하여 추가
    const kidData = new Blob(
      [
        JSON.stringify({
          name: name,
          birthDate: birthDate,
          gender: 'M',
        }),
      ],
      { type: 'application/json' },
    );

    // FormData에 kid 데이터 추가
    formData.append('kid', kidData);

    // 프로필 이미지 파일이 있을 때만 추가
    if (profileImageFile) {
      formData.append('profileImage', profileImageFile); // 파일 추가
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/kids`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization 헤더 추가
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        console.log(`createKid Server Error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error UserAPI-createKid');
      throw error;
    }
  };

  const getKids = async (accessToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/kids`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status != 200) {
        console.log(`createKid Server Error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.log('Error UserAPI-getKids');
      throw error;
    }
  };

  // 아이가 스토리 라인을 읽어봤는지 확인 API
  const kidSearch = async (accessToken, kidId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/kids/${kidId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status != 200) {
        console.log(`checkStory Server Error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.log('Error UserAPI-checkStory');
      throw error;
    }
  };

  return { login, idDuplicate, signUp, createKid, getKids, kidSearch };
};

export default UserAPI;
