import axios from 'axios';
import { getToken } from '@/utils/bakingCookies.ts';
import { getRefreshToken } from '@/api/outh.ts';

// 액세스 토큰 및 리프레시 토큰이 없는 인스턴스
const clientInstance = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL,
});

clientInstance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Access-Control-Allow-Origin'] = import.meta.env.VITE_CLIENT_URL;
    config.headers['Access-Control-Allow-Credentials'] = 'true';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

clientInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API 호출 오류:', error);
    return Promise.reject(error);
  },
);

// 액세스 토큰만 있는 인스턴스
const authClientInstance = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL,
});

authClientInstance.interceptors.request.use(
  (config) => {
    const token = getToken('BIBLIOPHILE_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
      config.headers['Access-Control-Allow-Origin'] = import.meta.env.VITE_CLIENT_URL;
      config.headers['Access-Control-Allow-Credentials'] = 'true';
    } else console.error('에세스 토큰 없음!!');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authClientInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API 호출 오류:', error);
    return Promise.reject(error);
  },
);

// 액세스 토큰 및 리프레시 토큰 둘 다 있는 인스턴스
const authWithRefreshClientInstance = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL,
});

authWithRefreshClientInstance.interceptors.request.use(
  (config) => {
    const accessToken = getToken('BIBLIOPHILE_TOKEN'); // 액세스 토큰 가져오기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers['Content-Type'] = 'application/json';
      config.headers['Access-Control-Allow-Origin'] = import.meta.env.VITE_CLIENT_URL;
      config.headers['Access-Control-Allow-Credentials'] = 'true';
    } else console.error('');

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authWithRefreshClientInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      const refreshToken = getToken('BIBLIOPHILE_TOKEN_REFRESH');

      if (refreshToken) {
        try {
          const { status } = await getRefreshToken();
          const newAccessToken = getToken(
            '4%2F0AQlEd8xwtxAXYSfdKbc4P2pl-5ZwUlCW7e8tvuGRyiO2sPjxLwgRh3X5vXzo5uyD1vUBPQ',
          );

          if (status === 200) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers['Content-Type'] = 'application/json';
            originalRequest.headers['Access-Control-Allow-Origin'] = import.meta.env.VITE_CLIENT_URL;
            originalRequest.headers['Access-Control-Allow-Credentials'] = 'true';
          }

          return axios(originalRequest);
        } catch (refreshError) {
          console.error('리프레시 토큰 오류:', refreshError);
          return Promise.reject(refreshError);
        }
      }
    }

    console.error('API 호출 오류:', error);
    return Promise.reject(error);
  },
);

export { clientInstance, authClientInstance, authWithRefreshClientInstance };
