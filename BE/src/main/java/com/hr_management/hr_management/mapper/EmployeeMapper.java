package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.EmployeeCreationResponseDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {BankMapper.class, PositionMapper.class, DepartmentMapper.class, AccountMapper.class})
public interface EmployeeMapper {
    @Mapping(target = "bank", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "department", ignore = true)
    EmployeeResponseDTO ToEmployeeResponseDTO(Employee employee);


    Employee ToEmployee(EmployeeUpdateRequestDTO employeeUpdateRequestDTO);

    Employee MapEmployeeCreationRequestDTOToEmployee(EmployeeProfileCreationRequestDTO employeeProfileCreationRequestDTO);

    EmployeeCreationResponseDTO ToEmployeeProfileCreationRequestDTO(Employee employee);
}