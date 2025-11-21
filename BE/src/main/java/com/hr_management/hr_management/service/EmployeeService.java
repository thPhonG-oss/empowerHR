package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.repository.EmployeeRepository;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

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

}
