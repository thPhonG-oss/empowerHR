package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
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
}