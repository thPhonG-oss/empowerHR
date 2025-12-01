package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance,Integer> {
    Optional<Attendance> findByEmployee_EmployeeIdAndAttendanceDate(Integer id, LocalDate date);

}
