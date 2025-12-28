package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.entity.MonthlyReward;
import com.hr_management.hr_management.repository.MonthlyRewardRepository;
import com.hr_management.hr_management.service.MonthlyRewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MonthlyRewardServiceImpl implements MonthlyRewardService {
    private final MonthlyRewardRepository monthlyRewardRepository;

    @Override
    public MonthlyReward getMonthlyRewardByPositionIdAndPointPolicyId(Integer positionId, Integer pointPolicyId) {
        return monthlyRewardRepository.findByPositionIdAndPointPolicy_PointPolicyId(positionId, positionId);
    }
}
