import axiosClient from "./axiosClient";

const departmentApi = {
  getAllDepartment: () => axiosClient.get("/api/v1/departments"),
};

export default departmentApi;
