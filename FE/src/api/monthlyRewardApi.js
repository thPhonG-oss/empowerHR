import axiosClient from "./axiosClient";

const monthlyRewardApi = {
    updateMonthlyReward: (rewardId, data) =>
        axiosClient.put(`/api/v1/monthly-reward/${rewardId}`, data),

    updateDepartmentPoint: (departmentId, data) =>
        axiosClient.put(`/api/v1/departments/${departmentId}/points`, data),
}

export default monthlyRewardApi;
