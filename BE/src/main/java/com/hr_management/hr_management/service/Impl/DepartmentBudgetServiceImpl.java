package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.BudgetDepartmentRequest;
import com.hr_management.hr_management.dto.response.BudgeDepartmentResponse;
import com.hr_management.hr_management.dto.response.DepartmentBudgetResponseDTO;
import com.hr_management.hr_management.dto.response.DepartmentResponse;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.entity.DepartmentBudget;
import com.hr_management.hr_management.entity.PointPolicy;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.DepartmentBudgetMapper;
import com.hr_management.hr_management.repository.DepartmentBudgetRepository;
import com.hr_management.hr_management.repository.DepartmentRepository;
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
    DepartmentRepository departmentRepository;

    @Override
    public List<DepartmentBudgetResponseDTO> getDepartmentBudgets() {

        List<DepartmentBudget> budgets = departmentBudgetRepository.findAll();
        return budgets.stream()
                .map(departmentBudgetMapper::toDepartmentBudgetResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentBudgetResponseDTO getDepartmentBudgetById(Integer id) {
        DepartmentBudget budget = departmentBudgetRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_BUDGET_NOT_FOUND));

        return departmentBudgetMapper.toDepartmentBudgetResponseDTO(budget);
    }

    @Override
    public List<DepartmentBudgetResponseDTO> getDepartmentBudgetsByDepartmentId(Integer departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(()-> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        List<DepartmentBudget> budgets = departmentBudgetRepository
                .findByDepartment_DepartmentIdOrderByStartDateDesc(departmentId);

        return budgets.stream()
                .map(departmentBudgetMapper::toDepartmentBudgetResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BudgeDepartmentResponse updateDepartmentBudge(Integer departmentId, BudgetDepartmentRequest budgetDepartmentRequest) {
        DepartmentBudget departmentBudget=departmentBudgetRepository.findById(departmentId).orElseThrow(()->new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
        PointPolicy pointPolicy=departmentBudget.getPointPolicy();
        if(pointPolicy.getEndDate().isBefore(LocalDate.now()))
            throw  new AppException(ErrorCode.NOT_EDIT_PAST_TIME);
        departmentBudget.setBudget(budgetDepartmentRequest.getBudget());
        return departmentBudgetMapper.toBudgeDepartmentResponse(departmentBudgetRepository.save(departmentBudget));
    }
}
