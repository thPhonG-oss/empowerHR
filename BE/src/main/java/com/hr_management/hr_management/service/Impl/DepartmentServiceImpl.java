package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.DepartmentResponseDTO;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.DepartmentMapper;
import com.hr_management.hr_management.repository.DepartmentRepository;
import com.hr_management.hr_management.service.DepartmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentServiceImpl implements DepartmentService {
    DepartmentRepository departmentRepository;
    DepartmentMapper departmentMapper;

    @Override
    public List<DepartmentResponseDTO> getAllDepartments(){
        List<Department> departments = departmentRepository.findAll();
        if(departments.isEmpty()){
            throw new AppException(ErrorCode.DEPARTMENT_IS_EMPTY);
        }

        List<DepartmentResponseDTO> departmentResponseDTOS = new ArrayList<>();

        for(Department department : departments){
            departmentResponseDTOS.add(departmentMapper.toDepartmentResponseDTO(department));
        }

        return departmentResponseDTOS;
    }
}
