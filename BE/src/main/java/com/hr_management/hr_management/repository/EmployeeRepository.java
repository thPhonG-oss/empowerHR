package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    List<Employee> findAllByDepartment_DepartmentId(Long departmentId);
    Employee findAllByAccount_AccountId(Integer accountId);

}
