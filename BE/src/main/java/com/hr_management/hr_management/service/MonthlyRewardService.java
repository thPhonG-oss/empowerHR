package com.hr_management.hr_management.service;

import com.hr_management.hr_management.entity.MonthlyReward;

public interface MonthlyRewardService {
    MonthlyReward getMonthlyRewardByPositionIdAndPointPolicyId(Integer positionId, Integer pointPolicyId);
}
