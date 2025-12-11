import axiosClient from "./axiosClient";

const employeeApi = {
  getMyProfile: () => axiosClient.get("/api/v1/employee/profile"),
  updateMyProfile: (data) => axiosClient.put("/api/v1/employee/profile", data),
  getLeaveType: () => axiosClient.get("/api/v1/employee/leave-type"),
  filterLeaveType: (data) =>
    axiosClient.get("/api/v1/employee/filter-leave-days", {
      leaveTypeId: leaveTypeId,
    }),
  makeLeaveRequest: (data) =>
    axiosClient.post("/api/v1/employee/requests/leaves", data),
  makeUpdateTimeSheetRequest: (data) =>
    axiosClient.post("/api/v1/employee/requests/timesheet", data),
  getMyRequest: (page = 1, limit = 10) =>
    axiosClient.get("/api/v1/requests/my-request", {
      params: { page, limit },
    }),
  getMyAttendances: () => axiosClient.get("/api/v1/employee/attendances"),
};

export default employeeApi;
