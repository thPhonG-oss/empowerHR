package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.request.GetAllEmployeeDepartmentRequest;
import com.hr_management.hr_management.dto.response.EmployeeCreationResponseDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.GetAllEmployeeDepartmentResponse;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface EmployeeService {
    EmployeeResponseDTO getEmployeeById(Integer employeeId);

    @Transactional
    EmployeeCreationResponseDTO updateEmloyeeProfileByEmployeeId(Integer employeeId, EmployeeUpdateRequestDTO employeeUpdateRequestDTO);

    @Transactional
    EmployeeCreationResponseDTO createNewEmployeeProfile(EmployeeProfileCreationRequestDTO request);

    String generateEmployeeCode(Integer employeeId);
    GetAllEmployeeDepartmentResponse getAllEmployeeDepartment(GetAllEmployeeDepartmentRequest request, JwtAuthenticationToken jwtAuthenticationToken);
}
