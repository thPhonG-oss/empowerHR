import axiosClient from "./axiosClient";

const employeeApi = {
  getMyProfile: () => axiosClient.get("/api/v1/employee/profile"),
  updateMyProfile: (data) => axiosClient.put("/api/v1/employee/profile", data),
  // Nghỉ phép
  getLeaveType: () => axiosClient.get("/api/v1/employee/leave-type"),
  makeLeaveRequest: (data) =>
    axiosClient.post("/api/v1/employee/requests/leaves", data),
};

export default employeeApi;
