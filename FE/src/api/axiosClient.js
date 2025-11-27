import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8081", // Chưa có API
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor → tự gắn token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  (error) => {
    // Nếu token hết hạn → chuyển về login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
