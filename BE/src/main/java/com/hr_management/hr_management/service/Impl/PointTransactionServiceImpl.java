package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.enums.ActivityStatus;
import com.hr_management.hr_management.enums.TransactionType;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.repository.PointAccountRepository;
import com.hr_management.hr_management.repository.RunningActivityRepository;
import com.hr_management.hr_management.repository.TransactionRepository;
import com.hr_management.hr_management.service.PointTransactionService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PointTransactionServiceImpl implements PointTransactionService {

    ParticipateInRepository participateInRepository;
    RunningActivityRepository runningActivityRepository;
    TransactionRepository transactionRepository;
    PointAccountRepository pointAccountRepository;

    /**
     * Tự động cộng điểm cho tất cả hoạt động đã kết thúc
     * Gọi từ Scheduler để chạy định kỳ
     */
    @Transactional
    public void processActivityRewardsForCompletedActivities() {
        System.out.println("=== Bắt đầu xử lý phần thưởng cho các hoạt động đã hoàn thành ===");

        // Tìm hoạt dộng đã kết thúc
        LocalDate currentDate = LocalDate.now();
        List<RunningActivity> completedActivities = runningActivityRepository
                .findCompletedActivities(ActivityStatus.Completed, currentDate);

        System.out.println("Tìm thấy " + completedActivities.size() + " hoạt động [đã hoàn thành] cần xử lý");

        for (RunningActivity activity : completedActivities) {
            try {
                // Trao thưởng hoat dong do
                processActivityRewards(activity);

                // Cập nhật status của hoạt động
                activity.setStatus(ActivityStatus.Completed);
                runningActivityRepository.save(activity);

                System.out.println("✅ Xử lý phần thưởng thành công cho hoạt động: " + activity.getRunningActivityId());
            } catch (Exception e) {
                System.out.println("❌ Có lỗi khi xử lý phần thưởng cho hoạt động: " + activity.getRunningActivityId());
                e.printStackTrace();
            }
        }

        System.out.println("=== Hoàn tất quá trình xử lý phần thưởng ===");
    }

    /**
     * Xử lý thưởng cho một hoạt động cụ thể
     */
    @Transactional
    public void processActivityRewards(RunningActivity activity) {
        System.out.println("Bắt đầu xử lý trao thưởng cho hoạt động: " + activity.getRunningActivityId());

        // Lấy tất cả những người tham gia chưa nhận thưởng
        List<ParticipateIn> participants = participateInRepository
                .findByActivityAndNotRewarded(activity);

        if (participants.isEmpty()) {
            System.out.println("⚠️ Không có người tham gia nào được thưởng cho hoạt động: " + activity.getRunningActivityId());
            return;
        }

        // Sắp xếp theo totalRun để xác định Top 1, 2, 3
        List<ParticipateIn> sortedParticipants = participateInRepository
                .findByActivityOrderByTotalRunDesc(activity);

        // Tự set rankPosition dựa vào vị trí trong danh sách
        for (int i = 0; i < sortedParticipants.size(); i++) {
            ParticipateIn p = sortedParticipants.get(i);
            if (!p.getIsCancelled()) {
                if (i == 0) {
                    p.setRankPosition(1);
                } else if (i == 1) {
                    p.setRankPosition(2);
                } else if (i == 2) {
                    p.setRankPosition(3);
                }
                participateInRepository.save(p);
            }
        }

        for (ParticipateIn participant : sortedParticipants) {
            if (participant.getIsCancelled()) {
                continue;
            }

            Employee employee = participant.getEmployee();
            PointAccount pointAccount = employee.getPointAccount();

            if (pointAccount == null) {
                System.out.println("⚠️ Nhân viên " + employee.getEmployeeId() + " không có tài khoản điểm");
                continue;
            }

            int totalRewardPoints = 0;

            // Cộng điểm hoàn thành chỉ cho những người không có rank (không phải Top 1, 2, 3)
            if (participant.getRankPosition() == null) {
                if (activity.getCompletionBonus() != null && activity.getCompletionBonus() > 0) {
                    totalRewardPoints += activity.getCompletionBonus();
                    createTransaction(
                            pointAccount,
                            activity.getCompletionBonus().longValue(),
                            TransactionType.ActivityReward
                    );
                    System.out.println("  ➕ Completion Bonus: " + activity.getCompletionBonus() + " points");
                }
            }

            // Cộng điểm Top chỉ cho Top 1, 2, 3 (không cộng thêm hoàn thành)
            if (participant.getRankPosition() != null) {
                if (participant.getRankPosition() == 1 && activity.getTop1Bonus() != null && activity.getTop1Bonus() > 0) {
                    totalRewardPoints = activity.getTop1Bonus();
                    createTransaction(
                            pointAccount,
                            activity.getTop1Bonus().longValue(),
                            TransactionType.ActivityReward
                    );
                    System.out.println("  🥇 Top 1 Bonus: " + activity.getTop1Bonus() + " points");
                }
                else if (participant.getRankPosition() == 2 && activity.getTop2Bonus() != null && activity.getTop2Bonus() > 0) {
                    totalRewardPoints = activity.getTop2Bonus();
                    createTransaction(
                            pointAccount,
                            activity.getTop2Bonus().longValue(),
                            TransactionType.ActivityReward
                    );
                    System.out.println("  🥈 Top 2 Bonus: " + activity.getTop2Bonus() + " points");
                }
                else if (participant.getRankPosition() == 3 && activity.getTop3Bonus() != null && activity.getTop3Bonus() > 0) {
                    totalRewardPoints = activity.getTop3Bonus();
                    createTransaction(
                            pointAccount,
                            activity.getTop3Bonus().longValue(),
                            TransactionType.ActivityReward
                    );
                    System.out.println("  🥉 Top 3 Bonus: " + activity.getTop3Bonus() + " points");
                }
            }

            // Cập nhật thông tin tham gia
            participant.setRewardPoints(totalRewardPoints);
            participant.setIsCompleted(true);
            participant.setCompletedDate(LocalDateTime.now());
            participateInRepository.save(participant);

            // Cập nhật điểm hiện tại
            pointAccount.setCurrentPoints(pointAccount.getCurrentPoints() + totalRewardPoints);
            pointAccount.setTotalEarns(pointAccount.getTotalEarns() + totalRewardPoints);
            pointAccount.setUpdateAt(LocalDateTime.now());
            pointAccountRepository.save(pointAccount);

            System.out.println("💰 Rewarded " + totalRewardPoints + " points to employee " +
                    employee.getEmployeeId() + " (" + employee.getEmployeeName() + ") " +
                    "for activity " + activity.getRunningActivityId());
        }
    }

    /**
     * Tạo giao dịch điểm cho employee
     */
    @Transactional
    public Transaction createTransaction(
            PointAccount pointAccount,
            Long points,
            TransactionType type) {

        Transaction transaction = Transaction.builder()
                .pointAccount(pointAccount)
                .points(points)
                .transactionType(type)
                .createAt(LocalDateTime.now())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        System.out.println("📝 Transaction created: ID=" + savedTransaction.getTransactionId() +
                ", Points=" + points + ", Type=" + type);

        return savedTransaction;
    }
}
