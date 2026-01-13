import axiosClient from "./axiosClient";

const transactionsApi = {
  getMyTransactions: () => axiosClient.get("/api/v1/transactions/my"),
  getAllTransactions: () => axiosClient.get("/api/v1/transactions"),
};

export default transactionsApi;
