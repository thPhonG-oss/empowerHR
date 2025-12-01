package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Request;
import com.hr_management.hr_management.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    @Query(value = "SELECT r FROM Request r " +
            "WHERE r.status IN ('Approved', 'Rejected')" +
            "AND r.employee.department.departmentId = :departmentId")
    Page<Request> findAllHandledRequests(@Param("departmentId") Integer departmentId, Pageable pageable);
    Page<Request> findAllByEmployee_EmployeeIdAndStatusIn( Integer employeeId, List<RequestStatus> status, Pageable pageable);

}
