package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.DepartmentBudgetResponseDTO;
import com.hr_management.hr_management.entity.DepartmentBudget;
import com.hr_management.hr_management.mapper.DepartmentBudgetMapper;
import com.hr_management.hr_management.repository.DepartmentBudgetRepository;
import com.hr_management.hr_management.service.DepartmentBudgetService;
import com.hr_management.hr_management.service.DepartmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentBudgetServiceImpl implements DepartmentBudgetService {
    DepartmentBudgetRepository departmentBudgetRepository;
    DepartmentBudgetMapper departmentBudgetMapper;

    @Override
    public List<DepartmentBudgetResponseDTO> getDepartmentBudgets() {

        List<DepartmentBudget> budgets = departmentBudgetRepository.findAll();
        return budgets.stream()
                .map(departmentBudgetMapper::toDepartmentBudgetResponseDTO)
                .collect(Collectors.toList());
    }
}
