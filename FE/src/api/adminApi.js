import axiosClient from "./axiosClient";

const adminApi = {
  getAllUsers: () => axiosClient.get("/api/v1/admin/api/v1/admin/employees"),
  getUserById: (id) => axiosClient.get(`/api/v1/admin/employees/${id}`),
  updateUserById: (id, data) =>
    axiosClient.put(`/api/v1/admin/employees/${id}`, data),
  addUser: (newUser) => axiosClient.post("/api/v1/admin/employees", newUser),
};

export default adminApi;
