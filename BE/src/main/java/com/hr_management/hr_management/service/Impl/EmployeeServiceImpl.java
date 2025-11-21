package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.controller.EmployeeController;
import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
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

import java.util.List;

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

    @Override
    public EmployeeResponseDTO getEmployeeByUserName(String username) {
        Employee existingEmployee = employeeRepository.findByAccount_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));

        EmployeeResponseDTO employeeResponseDTO = employeeMapper.ToEmployeeResponseDTO(existingEmployee);
        employeeResponseDTO.setBank(existingEmployee.getBank().getBankName());
        employeeResponseDTO.setDepartment(existingEmployee.getDepartment().getDepartmentName());
        employeeResponseDTO.setPosition(existingEmployee.getPosition().getPositionName());

        return employeeResponseDTO;
    }

    @Override
    public List<EmployeeResponseDTO> getAll() {
        var employee = employeeRepository.findAll();
        return employee.stream()
                .map(emp -> {
                    var dto = employeeMapper.ToEmployeeResponseDTO(emp);
                    dto.setBank(emp.getBank().getBankName());
                    dto.setDepartment(emp.getDepartment().getDepartmentName());
                    dto.setPosition(emp.getPosition().getPositionName());
                    return dto;
                })
                .toList();
    }

    @Override
    public EmployeeResponseDTO updateEmployeeProfileByUsername(String username, UpdateEmployeeProfileRequest request) {
        // Tìm employee
        Employee employee = employeeRepository.findByAccount_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));

        employeeMapper.updateEmployeeProfile(employee,request);
        employeeRepository.save(employee);
        return employeeMapper.ToEmployeeResponseDTO(employee);
    }
}
