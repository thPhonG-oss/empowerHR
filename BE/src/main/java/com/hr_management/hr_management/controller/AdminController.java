package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    EmployeeService employeeService;

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<Object>> getEmployee(@PathVariable Integer employeeId) {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .status(1000)
                        .message("Success")
                        .data(employeeService.getEmployeeById(employeeId))
                        .build()
        );
    }
}
