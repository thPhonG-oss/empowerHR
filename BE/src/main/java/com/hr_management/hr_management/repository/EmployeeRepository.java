package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.Attendance;
import com.hr_management.hr_management.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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

    boolean findEmployeeByEmail(String email);


    boolean existsByIdentityCardAndEmployeeIdNot(String identityCard, Integer employeeId);

    boolean existsByEmailAndEmployeeIdNot(String email, Integer employeeId);

    @Query(
        "SELECT e FROM Employee e WHERE e.department.departmentId = :departmentId"
    )
    Page<Employee> findAllEmployeesByDepartmentId(Integer departmentId, Pageable pageable);

    Optional<Employee> findByAccount(Account account);
}
