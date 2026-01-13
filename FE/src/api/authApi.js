import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/log-in", data),
  register: (data) => axiosClient.post("/auth/register", data),
  logout: () => axiosClient.post("/auth/log-out"),
  changePassword: (data) => axiosClient.post("/auth/change-password", data),
  confirmAccount: (data) => axiosClient.post("/auth/confirm-account", data),
};

export default authApi;
