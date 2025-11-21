package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.EmployeeCreationResponseDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import jakarta.transaction.Transactional;

public interface EmployeeService {
    EmployeeResponseDTO getEmployeeById(Integer employeeId);

    @Transactional
    EmployeeCreationResponseDTO updateEmloyeeProfileByEmployeeId(Integer employeeId, EmployeeUpdateRequestDTO employeeUpdateRequestDTO);

    @Transactional
    EmployeeCreationResponseDTO createNewEmployeeProfile(EmployeeProfileCreationRequestDTO request);

    String generateEmployeeCode(Integer employeeId);
}
