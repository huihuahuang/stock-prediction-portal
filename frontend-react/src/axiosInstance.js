import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_BASE_API;
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor
// what is config? => request
axiosInstance.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  // handle failed reponses
  async function (error) {
    // orginal request contains response code
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      const refreshToken = localStorage.getItem['refreshToken'];
      try {
        // Request new access token
        const response = await axiosInstance.post('/token/refresh', {
          refresh: refreshToken,
        });
        // update the local storage token
        localStorage.setItem('accessToken', response.data.access);
        // update the original request
        originalRequest.headers['Authorization'] =
          `Bearer ${response.data.access}`;
        // resend the request
        return axiosInstance(originalRequest);
      } catch {
        // when refresh token expires
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
