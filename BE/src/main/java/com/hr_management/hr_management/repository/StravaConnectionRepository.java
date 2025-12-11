package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.StravaConnections;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StravaConnectionRepository extends JpaRepository<StravaConnections, Integer> {
    @Query(
            value = "SELECT sc FROM StravaConnections sc WHERE sc.employee.employeeId = :employeeId"
    )
    StravaConnections findByEmployee_EmployeeId(@Param("employeeId") Integer employeeId);
}
