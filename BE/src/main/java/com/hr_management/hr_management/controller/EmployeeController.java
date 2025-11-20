package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.response.EmployeeResponse;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmployeeController {

    EmployeeService employeeService;

    // [ Admin ]
    // 1. Xem danh sách nhân viên
    @GetMapping("/employees")
    public ApiResponse<List<EmployeeResponse>> getAll() {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getAll())
                .build();
    }

    // [Manager] 1. Xem chi tiết hồ sơ nhân viên
    @GetMapping("/employees/{employeeId}")
    public ApiResponse<EmployeeResponse> getEmployeeById(
            @PathVariable Integer employeeId
    ) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.getEmployeeById(employeeId))
                .build();
    }


    // [ Employee ]
    // 1. Xem hồ sơ cá nhân
    // 2. Cập nhật thông tin cá nhân
}
