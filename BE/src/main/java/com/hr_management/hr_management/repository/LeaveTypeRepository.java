package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveTypeRepository extends JpaRepository<LeaveType,Integer> {
}
