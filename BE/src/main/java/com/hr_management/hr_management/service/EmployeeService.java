package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.repository.EmployeeRepository;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;
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


    EmployeeResponseDTO getEmployeeByUserName(String username);

    // [ Admin ]
    // 1. Xem danh sách nhân viên
    public List<EmployeeResponseDTO> getAll();

    // [ Employee ]
    // 1. Xem hồ sơ cá nhân
    // 2. Cập nhật thông tin cá nhân
    EmployeeResponseDTO updateEmployeeProfileByUsername(String username, UpdateEmployeeProfileRequest request);

    @Transactional
    EmployeeCreationResponseDTO updateEmloyeeProfileByEmployeeId(Integer employeeId, EmployeeUpdateRequestDTO employeeUpdateRequestDTO);

    @Transactional
    EmployeeCreationResponseDTO createNewEmployeeProfile(EmployeeProfileCreationRequestDTO request);

    String generateEmployeeCode(Integer employeeId);
    GetAllEmployeeDepartmentResponse getAllEmployeeDepartment(GetAllEmployeeDepartmentRequest request, JwtAuthenticationToken jwtAuthenticationToken);
}
