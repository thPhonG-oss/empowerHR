package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.MonthlyRewardRequest;
import com.hr_management.hr_management.dto.response.MonthlyRewardResponse;
import com.hr_management.hr_management.entity.MonthlyReward;

import java.util.List;

public interface MonthlyRewardService {
    MonthlyReward getMonthlyRewardByPositionIdAndPointPolicyId(Integer positionId, Integer pointPolicyId);
    List<MonthlyRewardResponse> getAllMonthlyReward();
    MonthlyRewardResponse updateMonthlyReward(Integer monthlyRewardId, MonthlyRewardRequest monthlyRewardRequest);
}
