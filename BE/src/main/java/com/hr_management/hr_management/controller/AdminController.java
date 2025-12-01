package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.request.AccountCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.service.AccountService;
import com.hr_management.hr_management.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
                        .data(employeeService.getFullEmployeeInfo(employeeId))
                        .build()
        );
    }

    @PutMapping("/employees/{employeeId}")
    public ResponseEntity<ApiResponse<Object>> updateEmployee(@PathVariable Integer employeeId, @RequestBody @Valid EmployeeUpdateRequestDTO request) {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .status(1000)
                        .message("Success")
                        .data(employeeService.updateEmloyeeProfileByEmployeeId(employeeId, request))
                        .build()
        );
    }

//    @PostMapping("/accounts")
//    public ResponseEntity<ApiResponse<Object>> createNewEmployeeAccount(@RequestBody AccountCreationRequestDTO request) {
//        return new ResponseEntity<>(
//                ApiResponse.builder()
//                        .status(1000)
//                        .message("Success")
//                        .data(accountService.createNewAccount(request))
//                        .build(),
//                HttpStatus.CREATED
//        );
//    }

    @PostMapping("/employees")
    public ResponseEntity<ApiResponse<Object>> createNewEmployeeProfile(@RequestBody @Valid EmployeeProfileCreationRequestDTO request) {
        return new ResponseEntity<>(
                ApiResponse.builder()
                        .status(1000)
                        .message("Success")
                        .data(employeeService.createNewEmployeeProfile(request))
                        .build(),
                HttpStatus.CREATED
        );
    }


    // [ Admin ]
    // 1. Xem danh sách nhân viên
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employees")
    public com.hr_management.hr_management.dto.request.ApiResponse<List<EmployeeResponseDTO>> getAll() {
        return com.hr_management.hr_management.dto.request.ApiResponse.<List<EmployeeResponseDTO>>builder()
                .result(employeeService.getAll())
                .build();
    }

    //[Admin] Block employee account
    @PatchMapping("/accounts/block/{employeeId}")
    public ResponseEntity<ApiResponse<Object>> blockEmployeeAccount(@PathVariable Integer employeeId) {
        accountService.blockAccountByEmployeeId(employeeId);
        return ResponseEntity.ok()
                .body(ApiResponse.builder().status(1000).message("Success").build());
    }
}
