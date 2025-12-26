package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.PerformancePointGivenRequestDTO;

public interface RewardService {
    void automateMonthlyRewards();

    // Manger give points to employee
    boolean givePointsToEmployee(PerformancePointGivenRequestDTO request);
}
