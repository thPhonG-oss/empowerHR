package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Optional<Employee> findByAccount_Username(String username);
    boolean findByEmployeeName(String employeeName);

    boolean existsByEmployeeName(String employeeName);

    boolean existsByIdentityCard(String identityCard);

    boolean existsByEmail(String email);
    List<Employee> findAllByDepartment_DepartmentId(Long departmentId);
    Employee findAllByAccount_AccountId(Integer accountId);

}
