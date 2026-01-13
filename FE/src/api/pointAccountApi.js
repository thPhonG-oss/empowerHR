import axiosClient from "./axiosClient";

const pointAccountApi = {
  getMyPoint: () => axiosClient.get("/api/v1/point-account/me"),
  getAllPoint: () => axiosClient.get("/api/v1/point-account"),
};

export default pointAccountApi;
