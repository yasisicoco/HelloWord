import axios from 'axios';

const BASE_URL = 'https://j11b206.p.ssafy.io';

const UserAPI = () => {
  // 유저 login
  const login = async (email, password) => {
    const data = { email: email, password: password };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`, // 요청을 보낼 경로
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status == 200) {
        return response.data;
      } else {
        console.log(`login Server Error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.log('Error UserAPI-login: 유저 정보가 존재하지 않거나 서버 에러');
      return 'fail';
      // throw error;
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

      if (response.status == 200) {
        return !response.data.data;
      } else {
        console.log(`isDuplicate Server Error: ${response.status}`);
      }
    } catch (error) {
      console.log('Error UserAPI-isDuplicate');
      return false;
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

      if (response.status == 200) {
        return true;
      } else {
        console.log(`signUp Server Error: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log('Error UserAPI-signup');
      return true;
    }
  };

  const createKid = async (name, birthDate, profileImageFile, accessToken) => {
    const formData = new FormData();

    // kid 객체를 JSON으로 구성하여 추가
    const kidData = JSON.stringify({
      name: name,
      birthDate: birthDate,
      gender: 'F', // 성별은 필요에 따라 수정하세요
    });

    // FormData에 kid 데이터와 파일 추가
    formData.append('kid', kidData); // kid 데이터를 JSON 문자열로 추가
    formData.append('profileImage', profileImageFile); // 파일 추가

    try {
      console.log('############################');
      console.log(kidData);
      console.log(profileImageFile);
      const response = await axios.post(`${BASE_URL}/api/kids`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization 헤더 추가
          // 'Content-Type': 'multipart/form-data'는 제거
        },
      });

      if (response.status === 200) {
        console.log('아이 만들기 성공');
        return response.data;
      } else {
        console.log(`createKid Server Error: ${response.status}`);
        return response.data;
      }
    } catch (error) {
      console.error('Error UserAPI-createKid', error.response);
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

      if (response.status == 200) {
        return response.data;
      } else {
        console.log(`createKid Server Error: ${response.status}`);
        return response.data;
      }
    } catch (error) {
      console.log('Error UserAPI-getKids');
    }
  };

  return { login, idDuplicate, signUp, createKid, getKids };
};

export default UserAPI;
