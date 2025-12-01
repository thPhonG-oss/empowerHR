package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.DepartmentResponse;
import com.hr_management.hr_management.dto.response.DepartmentResponseDTO;
import com.hr_management.hr_management.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    DepartmentResponseDTO toDepartmentResponseDTO(Department department);

    @Mapping(target = "employeeId", source = "manager.employeeId")
    @Mapping(target = "employeeCode", source = "manager.employeeCode")
    @Mapping(target = "employeeName", source = "manager.employeeName")
    DepartmentResponse toDepartmentResponse(Department department);
}
