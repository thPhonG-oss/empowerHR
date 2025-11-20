package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.request.AccountCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.service.AccountService;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {

    EmployeeService employeeService;
    AccountService accountService;

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

    @PutMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<Object>> updateEmployee(@PathVariable Integer employeeId, @RequestBody EmployeeUpdateRequestDTO request) {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .status(1000)
                        .message("Success")
                        .data(employeeService.updateEmloyeeProfileByEmployeeId(employeeId, request))
                        .build()
        );
    }

    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<Object>> createNewEmployeeAccount(@RequestBody AccountCreationRequestDTO request) {
        return new ResponseEntity<>(
                ApiResponse.builder()
                        .status(1000)
                        .message("Success")
                        .data(accountService.createNewAccount(request))
                        .build(),
                HttpStatus.CREATED
        );
    }
}
