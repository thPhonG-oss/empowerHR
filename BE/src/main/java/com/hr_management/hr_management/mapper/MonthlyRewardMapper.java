package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.MonthlyRewardRequest;
import com.hr_management.hr_management.dto.response.MonthlyRewardResponse;
import com.hr_management.hr_management.entity.MonthlyReward;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring",uses = {PositionMapper.class})
public interface MonthlyRewardMapper {
    MonthlyRewardResponse toMonthlyRewardResponse(MonthlyReward monthlyReward);
    MonthlyReward toMonthlyReward(MonthlyRewardRequest monthlyRewardRequest);
    List<MonthlyRewardResponse> toListMonthlyRewardResponse(List<MonthlyReward> monthlyReward);
}
