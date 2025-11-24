import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/log-in", data),
  register: (data) => axiosClient.post("/auth/register", data),
  logout: () => axiosClient.post("/auth/log-out"),
};

export default authApi;
