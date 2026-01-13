package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.BudgeDepartmentResponse;
import com.hr_management.hr_management.dto.response.DepartmentBudgetResponseDTO;
import com.hr_management.hr_management.entity.DepartmentBudget;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",uses = {DepartmentMapper.class})
public interface DepartmentBudgetMapper {
    @Mapping(target = "departmentName", source = "department.departmentName")
    @Mapping(target = "departmentId", source = "department.departmentId")
    @Mapping(target = "pointPolicyId", source = "pointPolicy.pointPolicyId")
    DepartmentBudgetResponseDTO toDepartmentBudgetResponseDTO(DepartmentBudget departmentBudget);
    BudgeDepartmentResponse toBudgeDepartmentResponse(DepartmentBudget departmentBudget);
}
