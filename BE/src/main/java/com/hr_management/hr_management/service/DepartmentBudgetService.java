package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.DepartmentBudgetResponseDTO;

import java.util.List;

public interface DepartmentBudgetService {
    List<DepartmentBudgetResponseDTO> getDepartmentBudgets();
}
