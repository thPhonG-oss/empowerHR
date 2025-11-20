package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    boolean existsByUsername(String username);
    Optional<Employee> findByUsername(String username);
}
