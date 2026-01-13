import axiosClient from "./axiosClient";

const pointPolicyApi = {
  getPointPolicy: () => axiosClient.get("/api/v1/point-policies/current"),
  updatePointPolicy: (id,data) => axiosClient.put(`/api/v1/rewards/point-policies/${id}`, data),
};

export default pointPolicyApi;
