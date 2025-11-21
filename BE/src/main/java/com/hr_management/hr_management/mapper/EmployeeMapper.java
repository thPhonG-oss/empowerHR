package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.*;
import com.hr_management.hr_management.entity.Bank;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.Position;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    @Mapping(target = "bank", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "department", ignore = true)
    EmployeeResponseDTO ToEmployeeResponseDTO(Employee employee);

    AllEmployeeResponse toEmployeeResponse(Employee employee);
    DepartmentResponse toDepartmentDTO(Department department);
    PositionResponse toPositionDTO(Position position);
    BankResponse toBankDTO(Bank bank);
}