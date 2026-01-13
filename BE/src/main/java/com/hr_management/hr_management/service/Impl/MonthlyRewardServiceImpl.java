package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.MonthlyRewardRequest;
import com.hr_management.hr_management.dto.response.MonthlyRewardResponse;
import com.hr_management.hr_management.entity.MonthlyReward;
import com.hr_management.hr_management.entity.PointPolicy;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.MonthlyRewardMapper;
import com.hr_management.hr_management.repository.MonthlyRewardRepository;
import com.hr_management.hr_management.repository.PointPolicyRepository;
import com.hr_management.hr_management.service.MonthlyRewardService;
import com.nimbusds.openid.connect.sdk.assurance.Policy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MonthlyRewardServiceImpl implements MonthlyRewardService {
    private final MonthlyRewardRepository monthlyRewardRepository;
    private final MonthlyRewardMapper monthlyRewardMapper;

    @Override
    public MonthlyReward getMonthlyRewardByPositionIdAndPointPolicyId(Integer positionId, Integer pointPolicyId) {
        return monthlyRewardRepository.findByPositionIdAndPointPolicy_PointPolicyId(positionId, positionId);
    }

    @Override
    public MonthlyRewardResponse updateMonthlyReward(Integer monthlyRewardId, MonthlyRewardRequest monthlyRewardRequest) {
        MonthlyReward monthlyReward=monthlyRewardRepository.findById(monthlyRewardId).orElseThrow(()->new AppException(ErrorCode.MONTHLY_NOT_FOUND));
        PointPolicy pointPolicy=monthlyReward.getPointPolicy();
        System.out.println("endDate = " + pointPolicy.getEndDate());
        System.out.println("today   = " + LocalDate.now());

        if(pointPolicy.getEndDate().isBefore(LocalDate.now()))
            throw  new AppException(ErrorCode.NOT_EDIT_PAST_TIME);
        monthlyReward.setMonthlyPoints(monthlyRewardRequest.getMonthlyPoints());
        return monthlyRewardMapper.toMonthlyRewardResponse(monthlyRewardRepository.save(monthlyReward));
    }

    @Override
    public List<MonthlyRewardResponse> getAllMonthlyReward() {
        List<MonthlyReward> monthlyRewards=monthlyRewardRepository.findAllByIsActive_True();
        return monthlyRewardMapper.toListMonthlyRewardResponse(monthlyRewards);
    }
}
