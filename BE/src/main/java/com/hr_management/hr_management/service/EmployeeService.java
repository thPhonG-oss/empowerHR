package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;

public interface EmployeeService {
    EmployeeResponseDTO getEmployeeById(Integer employeeId);
}
