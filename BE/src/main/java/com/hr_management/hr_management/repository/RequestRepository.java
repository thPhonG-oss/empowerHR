package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Request;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    @Query(value = "SELECT r FROM Request r " +
            "WHERE r.status IN ('Approved', 'Rejected')" +
            "AND r.employee.department.departmentId = :departmentId")
    Page<Request> findAllHandledRequests(@Param("departmentId") Integer departmentId, Pageable pageable);
}
