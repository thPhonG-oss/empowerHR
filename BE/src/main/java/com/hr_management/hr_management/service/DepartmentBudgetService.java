package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.BudgetDepartmentRequest;
import com.hr_management.hr_management.dto.response.BudgeDepartmentResponse;
import com.hr_management.hr_management.dto.response.DepartmentBudgetResponseDTO;
import com.hr_management.hr_management.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentBudgetService {
    List<DepartmentBudgetResponseDTO> getDepartmentBudgets();
    DepartmentBudgetResponseDTO getDepartmentBudgetById(Integer id);
    List<DepartmentBudgetResponseDTO> getDepartmentBudgetsByDepartmentId(Integer departmentId);
    BudgeDepartmentResponse updateDepartmentBudge(Integer departmentId, BudgetDepartmentRequest budgetDepartmentRequest);
}
