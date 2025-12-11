package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance,Integer> {
    LeaveBalance findByEmployee_EmployeeIdAndLeaveType_LeaveTypeIdAndYear(
            Integer employeeId, Integer leaveTypeId, Integer year);


    boolean existsByEmployee_EmployeeIdAndLeaveType_LeaveTypeIdAndYear(Integer employeeEmployeeId, Integer leaveTypeLeaveTypeId, Integer year);
}
