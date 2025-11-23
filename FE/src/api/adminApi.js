import axiosClient from "./axiosClient";

const adminApi = {
  getAllUsers: () => axiosClient.get("/api/v1/admin/api/v1/admin/employees"),
  getUserById: (id) => axiosClient.get(`/api/v1/admin/employees/${id}`),
};

export default adminApi;
