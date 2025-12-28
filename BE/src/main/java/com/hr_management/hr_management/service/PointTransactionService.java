package com.hr_management.hr_management.service;

import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.entity.PointAccount;
import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.entity.Transaction;
import com.hr_management.hr_management.enums.TransactionType;

public interface PointTransactionService {
    void processActivityRewardsForCompletedActivities();
    void processActivityRewards(RunningActivity activity);
    Transaction createTransaction(PointAccount pointAccount, Long points, TransactionType type);
}
