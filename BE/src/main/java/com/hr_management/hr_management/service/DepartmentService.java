package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.DepartmentResponse;
import com.hr_management.hr_management.dto.response.DepartmentResponseDTO;
import com.hr_management.hr_management.dto.response.EmployeesOfDepartmentResponseDTO;
import com.hr_management.hr_management.entity.Department;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> getAllDepartments();

    EmployeesOfDepartmentResponseDTO getAllEmployeesOfDepartment(Integer departmentId, Integer pageNumber, Integer pageSize);

    Department getDepartmentOfManager();
}
