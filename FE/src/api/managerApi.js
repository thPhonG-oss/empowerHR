import axiosClient from "./axiosClient";

const managerApi = {
  givePoint: (data) => axiosClient.post("/api/v1/manager/give-point", data),
};

export default managerApi;
