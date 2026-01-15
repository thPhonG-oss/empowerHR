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

// =====================
// REQUEST → Gắn accessToken
// =====================
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================
// RESPONSE → 401 thì logout (trừ auth api)
// =====================
axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isAuthApi = url.includes("/auth");

    if (status === 401 && !isAuthApi) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
