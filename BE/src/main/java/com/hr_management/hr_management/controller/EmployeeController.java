package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.GetAllEmployeeDepartmentRequest;
import com.hr_management.hr_management.dto.response.GetAllEmployeeDepartmentResponse;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RequestMapping("api/v1/employee")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {

    EmployeeService employeeService;

    @PreAuthorize("hasRole('ROLE_DEPARTMENT_MANAGER')")
    @PostMapping("/employee-department")
    ApiResponse<GetAllEmployeeDepartmentResponse> getAllEmployeeDepartment(@RequestBody GetAllEmployeeDepartmentRequest request, JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<GetAllEmployeeDepartmentResponse>builder()
                .result(employeeService.getAllEmployeeDepartment(request,jwtAuthenticationToken))
                .build();
    }

}
