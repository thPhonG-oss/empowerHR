import axiosClient from "./axiosClient";

const positionApi = {
  getAllPosition: () => axiosClient.get("/api/v1/positions"),
};

export default positionApi;
