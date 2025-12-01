package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.EmployeeCreationResponseDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.*;
import com.hr_management.hr_management.entity.Bank;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.Position;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {BankMapper.class, PositionMapper.class, DepartmentMapper.class, AccountMapper.class})
public interface EmployeeMapper {
    @Mapping(target = "bank", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "department", ignore = true)
    EmployeeResponseDTO ToEmployeeResponseDTO(Employee employee);

    @Mapping(target = "employeeId", ignore = true)
    @Mapping(target = "employeeCode", ignore = true)
    @Mapping(target = "employeeName", ignore = true)
    @Mapping(target = "identityCard", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    @Mapping(target = "gender", ignore = true)
    @Mapping(target = "startingDate", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "taxCode", ignore = true)
    @Mapping(target = "pointBalance", ignore = true)
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "position", ignore = true)
    @Mapping(target = "bank", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "address", source = "request.address")
    @Mapping(target = "email", source = "request.email")
    @Mapping(target = "phoneNumber", source = "request.phoneNumber")
    void updateEmployeeProfile(@MappingTarget Employee employee, UpdateEmployeeProfileRequest request);

    Employee ToEmployee(EmployeeUpdateRequestDTO employeeUpdateRequestDTO);

    Employee MapEmployeeCreationRequestDTOToEmployee(EmployeeProfileCreationRequestDTO employeeProfileCreationRequestDTO);

    EmployeeCreationResponseDTO toEmployeeCreationResponseDTO(Employee employee);
    AllEmployeeResponse toEmployeeResponse(Employee employee);
//    DepartmentResponse toDepartmentDTO(Department department);
    PositionResponse toPositionDTO(Position position);
    BankResponse toBankDTO(Bank bank);
}