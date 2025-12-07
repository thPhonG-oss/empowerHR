import axiosClient from "./axiosClient";

const employeeApi = {
  getMyProfile: () => axiosClient.get("/api/v1/employee/profile"),
  updateMyProfile: (data) => axiosClient.put("/api/v1/employee/profile", data),
  // Nghỉ phép
  getLeaveType: () => axiosClient.get("/api/v1/employee/leave-type"),
  makeLeaveRequest: (data) =>
    axiosClient.post("/api/v1/employee/requests/leaves", data),
  getMyRequest: (page = 1, limit = 10) =>
    axiosClient.get("/api/v1/requests/my-request", {
      params: { page, limit },
    }),
};

export default employeeApi;
