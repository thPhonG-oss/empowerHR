package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.Position;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.EmployeeMapper;
import com.hr_management.hr_management.repository.DepartmentRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.JobPositonRepository;
import com.hr_management.hr_management.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.autoconfigure.batch.BatchProperties;
import org.springframework.stereotype.Service;

import java.time.DateTimeException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeServiceImpl implements EmployeeService {

    EmployeeRepository employeeRepository;
    DepartmentRepository departmentRepository;
    JobPositonRepository jobPositonRepository;
    EmployeeMapper employeeMapper;


    @Override
    public EmployeeResponseDTO getEmployeeById(Integer employeeId) {
        EmployeeResponseDTO employeeResponseDTO;

        Employee existingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        employeeResponseDTO = employeeMapper.ToEmployeeResponseDTO(existingEmployee);
//        employeeResponseDTO.setBank(existingEmployee.getBank().getBankName());
//        employeeResponseDTO.setDepartment(existingEmployee.getDepartment().getDepartmentName());
//        employeeResponseDTO.setPosition(existingEmployee.getPosition().getPositionName());

        return employeeResponseDTO;
    }

    @Override
    public EmployeeResponseDTO updateEmloyeeProfileByEmployeeId(Integer employeeId, EmployeeUpdateRequestDTO employeeUpdateRequestDTO){
        Employee existingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        Department existingDepartment = departmentRepository.findById(employeeUpdateRequestDTO.getDepartmentId())
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        Position existingPosition = jobPositonRepository.findById(employeeUpdateRequestDTO.getPositionId())
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POSITION_NOT_FOUND));

        existingEmployee.setEmployeeCode(employeeUpdateRequestDTO.getEmployeeCode());
        existingEmployee.setEmployeeName(employeeUpdateRequestDTO.getEmployeeName());
        existingEmployee.setAddress(employeeUpdateRequestDTO.getAddress());
        existingEmployee.setEmail(employeeUpdateRequestDTO.getEmail());
        existingEmployee.setPhoneNumber(employeeUpdateRequestDTO.getPhoneNumber());
        existingEmployee.setIsActive(employeeUpdateRequestDTO.getIsActive());
        existingEmployee.setUpdatedAt(LocalDateTime.now());
        existingEmployee.setTaxCode(employeeUpdateRequestDTO.getTaxCode());
        existingEmployee.setDepartment(existingDepartment);
        existingEmployee.setPosition(existingPosition);


        return employeeMapper.ToEmployeeResponseDTO(employeeRepository.save(existingEmployee));
    }
}
