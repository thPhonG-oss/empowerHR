import axiosClient from "./axiosClient";

const requestApi = {
  getUnresolved: () => axiosClient.get("/api/v1/requests/unresolved"),
  approve: (requestId, note) =>
    axiosClient.patch(`/api/v1/requests/${requestId}`, {
      requestStatus: "Approved",
      responseReason: note || "Đồng ý",
    }),

  reject: (requestId, note) =>
    axiosClient.patch(`/api/v1/requests/${requestId}`, {
      requestStatus: "Rejected",
      responseReason: note,
    }),

  getHandled: (page = 1, size = 10) =>
    axiosClient.get(
      `/api/v1/requests/handled?pageNumber=${page}&pageSize=${size}`
    ),
};

export default requestApi;
