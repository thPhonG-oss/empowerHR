package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.GetAllEmployeeDepartmentRequest;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.GetAllEmployeeDepartmentResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface EmployeeService {
    EmployeeResponseDTO getEmployeeById(Integer employeeId);
    GetAllEmployeeDepartmentResponse getAllEmployeeDepartment(GetAllEmployeeDepartmentRequest request, JwtAuthenticationToken jwtAuthenticationToken);
}
