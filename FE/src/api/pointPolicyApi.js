import axiosClient from "./axiosClient";

const pointPolicyApi = {
  getPointPolicy: () => axiosClient.get("/api/v1/point-policies/current"),
};

export default pointPolicyApi;
