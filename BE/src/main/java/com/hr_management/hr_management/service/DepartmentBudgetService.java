package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.DepartmentBudgetResponseDTO;

import java.util.List;

public interface DepartmentBudgetService {
    List<DepartmentBudgetResponseDTO> getDepartmentBudgets();
    DepartmentBudgetResponseDTO getDepartmentBudgetById(Integer id);
    List<DepartmentBudgetResponseDTO> getDepartmentBudgetsByDepartmentId(Integer departmentId);

}
