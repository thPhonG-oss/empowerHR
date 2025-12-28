package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.DepartmentBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentBudgetRepository extends JpaRepository<DepartmentBudget, Integer> {
    @Query(
            value = "SELECT db.budget FROM DepartmentBudget db WHERE db.department.departmentId = :departmentId AND db.pointPolicy.pointPolicyId = :pointPolicyId"
    )
    Integer findBudgetPointsByDepartmentIdAndPointPolicyId(Integer departmentId, Integer pointPolicyId);
}
