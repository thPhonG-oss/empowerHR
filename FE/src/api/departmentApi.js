import axiosClient from "./axiosClient";

const departmentApi = {
  getAllDepartment: () => axiosClient.get("/api/v1/departments"),
  getEmployeesInDepartment: (id, pageNumber, pageSize) =>
    axiosClient.get(
      `/api/v1/departments/${id}/employees?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),
};

export default departmentApi;
