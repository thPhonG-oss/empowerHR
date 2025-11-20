package com.hr_management.hr_management.mapper;


import com.hr_management.hr_management.dto.request.EmployeeRequest;
import com.hr_management.hr_management.dto.response.EmployeeResponse;
import com.hr_management.hr_management.entity.Employee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    // chuyen dto sang entity
    Employee toEmployee(EmployeeRequest request);
    // chuyen entity sang dto
    EmployeeResponse toEmployeeResponse(Employee employee);
}
