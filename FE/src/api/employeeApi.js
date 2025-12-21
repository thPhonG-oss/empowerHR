import axiosClient from "./axiosClient";

const employeeApi = {
  getMyProfile: () => axiosClient.get("/api/v1/employees/profile"),
  updateMyProfile: (data) => axiosClient.put("/api/v1/employees/profile", data),
  getLeaveType: () => axiosClient.get("/api/v1/employees/leave-type"),
  filterLeaveType: (leaveTypeId) =>
    axiosClient.post(`/api/v1/employees/filter-leave-days`, leaveTypeId),
  makeLeaveRequest: (data) =>
    axiosClient.post("/api/v1/employees/requests/leaves", data),
  makeUpdateTimeSheetRequest: (data) =>
    axiosClient.post("/api/v1/employees/requests/timesheet", data),
  getMyRequest: (page = 1, limit = 10) =>
    axiosClient.get("/api/v1/requests/my-request", {
      params: { page, limit },
    }),
  getMyAttendances: () => axiosClient.get("/api/v1/employees/attendances"),
  checkIn: (data) => axiosClient.post("/api/v1/employees/checkin", data),
  checkOut: (data) => axiosClient.post("/api/v1/employees/checkout", data),
  getAttendanceToday: () =>
    axiosClient.get("/api/v1/employees/time-checkin-checkout"),
};

export default employeeApi;
