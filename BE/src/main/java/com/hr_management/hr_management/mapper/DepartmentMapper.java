package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.DepartmentResponseDTO;
import com.hr_management.hr_management.entity.Department;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    DepartmentResponseDTO toDepartmentResponseDTO(Department department);
}
