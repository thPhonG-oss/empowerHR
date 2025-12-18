package com.hr_management.hr_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.enums.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipateInRepository extends JpaRepository<ParticipateIn, Integer> {
    ParticipateIn findByEmployee_EmployeeIdAndRunningActivity_Status(Integer employeeId, ActivityStatus activityStatus);

    List<ParticipateIn> findAllByRunningActivity_RunningActivityId(Integer runningActivityId);
}
