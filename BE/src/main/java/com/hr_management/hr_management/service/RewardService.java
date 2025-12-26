package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.CashOutRequestDTO;
import com.hr_management.hr_management.dto.request.PerformancePointGivenRequestDTO;
import com.hr_management.hr_management.dto.response.CashOutTransactionResponseDTO;
import com.hr_management.hr_management.dto.response.PointPolicyResponseDTO;

public interface RewardService {
    // get current Point Policy, which is being applied(active)
    PointPolicyResponseDTO getCurrentPointPolicy();

    void automateMonthlyRewards();

    // auto refresh expired points of employees
    void refreshExpiredPoints();

    // Manger give points to employee
    boolean givePointsToEmployee(PerformancePointGivenRequestDTO request);

    CashOutTransactionResponseDTO cashOutPoints(CashOutRequestDTO request);
}
