package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.service.AuthenticationService;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final AuthenticationService authenticationService;

    // [ Admin ]
    // 1. Xem danh sách nhân viên

    @GetMapping("/api/v1/admin/employees")
    public ApiResponse<List<EmployeeResponseDTO>> getAll() {
        return ApiResponse.<List<EmployeeResponseDTO>>builder()
                .result(employeeService.getAll())
                .build();
    }

    // [ Employee ]
    // 1. Xem hồ sơ cá nhân

    @GetMapping("/api/v1/employee/profile")
    public ApiResponse<EmployeeResponseDTO> getMyProfile(JwtAuthenticationToken jwtToken){
        Integer employeeId = ((Number) jwtToken.getTokenAttributes().get("employeeId")).intValue();
        EmployeeResponseDTO profile = employeeService.getEmployeeById(employeeId);
        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(profile)
                .message("Profile retrieved successfully")
                .build();
    }
    // 2. Cập nhật thông tin cá nhân
    @PutMapping("/api/v1/employee/profile")
    public ApiResponse<EmployeeResponseDTO> updateMyProfile(JwtAuthenticationToken jwtToken, UpdateEmployeeProfileRequest request){
        Integer employeeId = ((Number) jwtToken.getTokenAttributes().get("employeeId")).intValue();
        EmployeeResponseDTO updatedProfile = employeeService.updateEmployeeProfile(employeeId, request);

        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(updatedProfile)
                .message("Profile updated successfully")
                .build();
    }




}
