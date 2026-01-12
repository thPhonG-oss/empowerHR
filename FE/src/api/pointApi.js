import axiosClient from "./axiosClient";

const pointApi = {
    getPointDerpartment: () => axiosClient.get("/api/v1/department-budgets"),
    getCurrentPolicy: () => axiosClient.get("/api/v1/point-policies/current"),
    getPointAllEmployees: () => axiosClient.get("/api/v1/point-account"),
    getAllTransactions: () => axiosClient.get("/api/v1/transactions"),
    getAllTranSactionsEmployee: (id) => axiosClient.get(`/api/v1/transactions/${id}`, { params: { employeeId: id } }),
}

export default pointApi;
