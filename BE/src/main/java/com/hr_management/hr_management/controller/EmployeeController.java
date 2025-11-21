package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.service.AuthenticationService;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final AuthenticationService authenticationService;

    // [ Admin ]
    // 1. Xem danh sách nhân viên
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/v1/admin/employees")
    public ApiResponse<List<EmployeeResponseDTO>> getAll() {
        return ApiResponse.<List<EmployeeResponseDTO>>builder()
                .result(employeeService.getAll())
                .build();
    }

    // [ MANGER ]
    // 1. Xem ho so chi tiet nhan vien
    @PreAuthorize("hasRole('DEPARTMENT_MANAGER')")
    @GetMapping("/api/v1/manager/employees/{employeeId}")
    public ApiResponse<EmployeeResponseDTO> getEmployeeByIdByManager(
            @PathVariable Integer employeeId){

        EmployeeResponseDTO employee = employeeService.getEmployeeById(employeeId);

        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(employee)
                .message("Employee retrieved successfully")
                .build();
    }

    // [ Employee ]
    // 1. Xem hồ sơ cá nhân

    @GetMapping("/api/v1/employee/profile")
    public ApiResponse<EmployeeResponseDTO> getMyProfile(JwtAuthenticationToken jwtToken){
        String username = jwtToken.getName();
        EmployeeResponseDTO profile = employeeService.getEmployeeByUserName(username);
        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(profile)
                .message("Profile retrieved successfully")
                .build();
    }
    // 2. Cập nhật thông tin cá nhân
    @PutMapping("/api/v1/employee/profile")
    public ApiResponse<EmployeeResponseDTO> updateMyProfile(JwtAuthenticationToken jwtToken, @RequestBody UpdateEmployeeProfileRequest request){
        String username = jwtToken.getName();
        EmployeeResponseDTO updatedProfile = employeeService.updateEmployeeProfileByUsername(username, request) ;

        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(updatedProfile)
                .message("Profile updated successfully")
                .build();
    }




}
