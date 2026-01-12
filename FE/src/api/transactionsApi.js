import axiosClient from "./axiosClient";

const transactionsApi = {
  getMyTransactions: () => axiosClient.get("/api/v1/transactions/my"),
};

export default transactionsApi;
