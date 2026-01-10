package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.response.DepartmentBudgetResponseDTO;
import com.hr_management.hr_management.service.DepartmentBudgetService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/department-budgets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentBudgetController {


    DepartmentBudgetService departmentBudgetService;
    @GetMapping("")
    public ApiResponse<List<DepartmentBudgetResponseDTO>> getAllDepartmentBudgets() {
        List<DepartmentBudgetResponseDTO> budgets = departmentBudgetService.getDepartmentBudgets();

        return ApiResponse.<List<DepartmentBudgetResponseDTO>>builder()
                .message("Get all department budgets successfully")
                .data(budgets)
                .build();
    }
}
