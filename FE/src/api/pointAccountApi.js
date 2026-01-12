import axiosClient from "./axiosClient";

const pointAccountApi = {
  getMyPoint: () => axiosClient.get("/api/v1/point-account/me"),
};

export default pointAccountApi;
