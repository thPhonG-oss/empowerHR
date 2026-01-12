package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.enums.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RunningActivityRepository extends JpaRepository<RunningActivity, Integer> {
    // Define custom query methods here if needed
    List<RunningActivity> findByStatusNotIn(List<ActivityStatus> statuses);

    @Query("SELECT r FROM RunningActivity r WHERE r.status = :status AND r.endDate <= :currentDate")
    List<RunningActivity> findCompletedActivities(ActivityStatus status, LocalDate currentDate);
}
