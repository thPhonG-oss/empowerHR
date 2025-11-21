package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // [ Admin ]
    // 1. Xem danh sách nhân viên
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/v1/admin/employees")
    public ApiResponse<List<EmployeeResponseDTO>> getAll() {
        return ApiResponse.<List<EmployeeResponseDTO>>builder()
                .result(employeeService.getAll())
                .build();
    }

}
