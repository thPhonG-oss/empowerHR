package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.enums.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipateInRepository extends JpaRepository<ParticipateIn, Integer> {
    List<ParticipateIn> findAllByRunningActivity_RunningActivityId(Integer runningActivityId);

    ParticipateIn findByEmployee_EmployeeIdAndRunningActivity_Status(Integer employeeEmployeeId, ActivityStatus runningActivityStatus);
}
