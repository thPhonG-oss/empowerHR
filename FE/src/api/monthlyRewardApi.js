import axiosClient from "./axiosClient";

const monthlyRewardApi = {
    updateMonthlyReward: (rewardId, data) =>
        axiosClient.put(`/api/v1/monthly-reward/${rewardId}`, data),

    updateDepartmentPoint: (departmentBudgeId, data) =>
        axiosClient.put(`/api/v1/department-budgets/${departmentBudgeId}`, data),
}

export default monthlyRewardApi;
