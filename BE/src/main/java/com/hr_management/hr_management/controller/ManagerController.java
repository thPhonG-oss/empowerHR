package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.GetAllEmployeeDepartmentRequest;
import com.hr_management.hr_management.dto.request.PerformancePointGivenRequestDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.GetAllEmployeeDepartmentResponse;
import com.hr_management.hr_management.service.EmployeeService;
import com.hr_management.hr_management.service.RewardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/manager")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerController {

    private final EmployeeService employeeService;
    private final RewardService rewardService;

    // 1. Xem ho so chi tiet nhan vien
    @PreAuthorize("hasRole('DEPARTMENT_MANAGER')")
    @GetMapping("/employees/{employeeId}")
    public ApiResponse<EmployeeResponseDTO> getEmployeeByIdByManager(
            @PathVariable Integer employeeId){

        EmployeeResponseDTO employee = employeeService.getEmployeeById(employeeId);

        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(employee)
                .message("Employee retrieved successfully")
                .build();
    }

    @PreAuthorize("hasRole('ROLE_DEPARTMENT_MANAGER')")
    @PostMapping("/employee-department")
    ApiResponse<GetAllEmployeeDepartmentResponse> getAllEmployeeDepartment(@RequestBody GetAllEmployeeDepartmentRequest request, JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<GetAllEmployeeDepartmentResponse>builder()
                .result(employeeService.getAllEmployeeDepartment(request,jwtAuthenticationToken))
                .build();
    }

    @PostMapping("/give-point")
    public ResponseEntity<ApiResponse<?>> givePointToEmployee(@RequestBody PerformancePointGivenRequestDTO request){
        boolean isSuccess = rewardService.givePointsToEmployee(request);
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .result(isSuccess)
                        .message(isSuccess ? "Points given successfully" : "Failed to give points")
                        .build()
        );
    }
}
