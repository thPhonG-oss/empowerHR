import axios from "axios";

const PORT = import.meta.env.VITE_PORT_BE;

const axiosClient = axios.create({
  baseURL: `http://localhost:${PORT}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// LẤY TOKEN
// =====================
const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// =====================
// REQUEST → Gắn accessToken
// =====================
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =====================
// RESPONSE → Tự Refresh Token
// =====================
let isRefreshing = false;
let queue = [];

axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu accessToken hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // ===== Nếu chưa refresh → refresh
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.post(
            `http://localhost:${PORT}/auth/refresh-token`,
            {
              refreshToken: getRefreshToken(),
            }
          );

          const newAccessToken = res.data?.accessToken;
          localStorage.setItem("token", newAccessToken);

          // Chạy lại các request đang đợi
          queue.forEach((cb) => cb(newAccessToken));
          queue = [];

          isRefreshing = false;

          // Retry lại request ban đầu
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (err) {
          isRefreshing = false;
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          // Tuỳ bạn: điều hướng về login
          window.location.href = "/login";

          return Promise.reject(err);
        }
      }

      // ===== Nếu refresh đang chạy → đợi
      return new Promise((resolve) => {
        queue.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
