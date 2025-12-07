package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.service.DepartmentService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentController {

    DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<Object> getAllDepartments() {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .code("1000")
                        .message("Success")
                        .result(departmentService.getAllDepartments())
                        .build()
        );
    }

    @GetMapping("/{departmentId}/employees" )
    public ResponseEntity<Object> getEmployeesOfDepartment(
            @PathVariable Integer departmentId,
            @RequestParam(name = "pageNumber", defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .code("1000")
                        .message("Success")
                        .result(departmentService.getAllEmployeesOfDepartment(departmentId, pageNumber, pageSize))
                        .build()
        );
    }
}
