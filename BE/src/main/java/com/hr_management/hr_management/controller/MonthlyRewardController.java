package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.MonthlyRewardRequest;
import com.hr_management.hr_management.dto.response.MonthlyRewardResponse;
import com.hr_management.hr_management.service.MonthlyRewardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/monthly-reward")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MonthlyRewardController {
    MonthlyRewardService monthlyRewardService;
    @GetMapping
    public ApiResponse<List<MonthlyRewardResponse>> getAllMonthlyReward(){
        return ApiResponse.<List<MonthlyRewardResponse>>builder()
                .result(monthlyRewardService.getAllMonthlyReward())
                .build();
    }
    @PutMapping("/{rewardId}")
    public ApiResponse<MonthlyRewardResponse> updatePointPosition(@PathVariable Integer rewardId, @RequestBody MonthlyRewardRequest monthlyRewardRequest){
        return ApiResponse.<MonthlyRewardResponse>builder()
                .result(monthlyRewardService.updateMonthlyReward(rewardId,monthlyRewardRequest))
                .build();
    }
}
