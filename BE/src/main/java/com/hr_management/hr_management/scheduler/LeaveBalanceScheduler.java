package com.hr_management.hr_management.scheduler;

import com.hr_management.hr_management.service.LeaveBalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeaveBalanceScheduler {
    private final LeaveBalanceService leaveBalanceService;

    @Scheduled(cron = " 0 0 0 1 1 ?", zone = "Asia/Ho_Chi_Minh") // Runs at midnight on January 1st every year
    public void scheduleAnnualLeaveBalanceCreation() {
        leaveBalanceService.generateAnnualLeaveBalances();
    }
}
