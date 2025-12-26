package com.hr_management.hr_management.scheduler;

import com.hr_management.hr_management.service.PointAccountService;
import com.hr_management.hr_management.service.RewardService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class RewardScheduler {
    RewardService rewardService;

    // This method can be scheduled to run at specific intervals using @Scheduled annotation
    @Scheduled(cron = "0 0 0 1 * ?", zone = "Asia/Ho_Chi_Minh") // Runs at midnight on the first day of every month
    public void automateMonthlyRewards() {
        rewardService.automateMonthlyRewards();
    }

    // Refresh points of employees at the start of each year
    @Scheduled(cron = "0 0 0 1 1 ?", zone = "Asia/Ho_Chi_Minh") // Runs at midnight on January 1st every year
    public void refreshExpiredPoints() {
        rewardService.refreshExpiredPoints();
    }
}
