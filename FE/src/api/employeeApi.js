import axiosClient from "./axiosClient";

const employeeApi = {
  getMyProfile: () => axiosClient.get("/api/v1/employee/profile"),
  updateMyProfile: (data) => axiosClient.put("/api/v1/employee/profile", data),
};

export default employeeApi;
