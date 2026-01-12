package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.MonthlyReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthlyRewardRepository extends JpaRepository<MonthlyReward, Integer> {
    @Query(
            value = "SELECT mr FROM MonthlyReward mr WHERE mr.position.positionId = ?1 AND mr.pointPolicy.pointPolicyId = ?2"
    )
    MonthlyReward findByPositionIdAndPointPolicy_PointPolicyId(Integer positionId, Integer pointPolicyId);
}
