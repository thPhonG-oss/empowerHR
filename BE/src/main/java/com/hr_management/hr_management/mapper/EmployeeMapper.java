package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.EmployeeResponseDTO;
import com.hr_management.hr_management.entity.Employee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    Employee toEmployee(EmployeeResponseDTO employeeResponseDTO);
    EmployeeResponseDTO toEmployeeResponseDTO(Employee employee);
}
