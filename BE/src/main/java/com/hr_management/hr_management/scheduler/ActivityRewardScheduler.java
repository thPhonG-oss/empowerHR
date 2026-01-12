package com.hr_management.hr_management.scheduler;

import com.hr_management.hr_management.service.PointTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ActivityRewardScheduler {
    private final PointTransactionService pointTransactionService;

    /**
     * Chạy mỗi ngày lúc 00:00 để kiểm tra hoạt động đã kết thúc và cộng điểm
     */
//    @Scheduled(cron = "0 0 0 * * *") // Cron: 00:00 mỗi ngày
//    public void scheduleActivityRewardProcessing() {
//        log.info("=== Bắt đầu chạy tác vụ tự động cộng điểm cho hoạt động đã kết thúc  ===");
//        pointTransactionService.processActivityRewardsForCompletedActivities();
//        log.info("=== Hoàn tất tác vụ tự động cộng điểm cho hoạt động đã kết thúc ===");
//    }

    /**
     * Alternative: Chạy mỗi 1 giờ để check thường xuyên hơn
     */
    @Scheduled(fixedDelay = 60 * 60 * 1000) // 1 giờ = 3600000ms
    public void scheduleActivityRewardProcessingHourly() {
        log.info("=== Bắt đầu chạy tác vụ tự động cộng điểm cho hoạt động đã kết thúc  ===");
        pointTransactionService.processActivityRewardsForCompletedActivities();
        log.info("=== Hoàn tất tác vụ tự động cộng điểm cho hoạt động đã kết thúc ===");
    }
}
