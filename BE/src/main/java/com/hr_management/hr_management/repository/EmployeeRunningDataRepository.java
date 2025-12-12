package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.EmployeeRunningData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRunningDataRepository extends JpaRepository<EmployeeRunningData, Long> {
    boolean existsByStravaActivityId(Long stravaActivityId);
}
