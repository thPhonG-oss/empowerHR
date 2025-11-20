package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.EmployeeResponseDTO;

public interface EmployeeService {
    EmployeeResponseDTO getEmployeeById(Long employeeId);
}
