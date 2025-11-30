package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest,Integer> {
}
