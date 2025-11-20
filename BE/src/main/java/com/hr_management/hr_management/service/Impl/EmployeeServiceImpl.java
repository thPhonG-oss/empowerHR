package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.controller.EmployeeController;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.EmployeeMapper;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeServiceImpl implements EmployeeService {

    EmployeeRepository employeeRepository;
    EmployeeMapper employeeMapper;


    @Override
    public EmployeeResponseDTO getEmployeeById(Integer employeeId) {
        EmployeeResponseDTO employeeResponseDTO;

        Employee existingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));

        employeeResponseDTO = employeeMapper.ToEmployeeResponseDTO(existingEmployee);
        employeeResponseDTO.setBank(existingEmployee.getBank().getBankName());
        employeeResponseDTO.setDepartment(existingEmployee.getDepartment().getDepartmentName());
        employeeResponseDTO.setPosition(existingEmployee.getPosition().getPositionName());

        return employeeResponseDTO;
    }
}
