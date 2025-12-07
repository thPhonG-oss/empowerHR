package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.AllEmployeeResponse;
import com.hr_management.hr_management.dto.response.DepartmentResponse;
import com.hr_management.hr_management.dto.response.EmployeesOfDepartmentResponseDTO;
import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.Role;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.DepartmentMapper;
import com.hr_management.hr_management.mapper.EmployeeMapper;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.DepartmentRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.service.DepartmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentServiceImpl implements DepartmentService {
    DepartmentRepository departmentRepository;
    DepartmentMapper departmentMapper;
    AccountRepository accountRepository;
    EmployeeRepository employeeRepository;
    EmployeeMapper employeeMapper;

    @Override
    public List<DepartmentResponse> getAllDepartments(){
        List<Department> departments = departmentRepository.findAll();
        if(departments.isEmpty()){
            throw new AppException(ErrorCode.DEPARTMENT_IS_EMPTY);
        }

        List<DepartmentResponse> departmentResponses = new ArrayList<>();

        for(Department department : departments){
            log.info("department: {}", department.toString());
            departmentResponses.add(departmentMapper.toDepartmentResponse(department));
        }

        return departmentResponses;
    }

    @Override
    public EmployeesOfDepartmentResponseDTO getAllEmployeesOfDepartment(Integer departmentId, Integer pageNumber, Integer pageSize){
//        Department dept = getDepartmentOfManager();

        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize, Sort.by("employeeId").ascending());

        Page<Employee> employeePage = employeeRepository.findAllEmployeesByDepartmentId(departmentId, pageable);

        List<AllEmployeeResponse> employeeResponseDTOS = employeePage.getContent().stream()
                .map(employeeMapper::toEmployeeResponse)
                .collect(Collectors.toList());

        return EmployeesOfDepartmentResponseDTO.builder()
                .employeeResponseDTOS(employeeResponseDTOS)
                .pageNumber(employeePage.getNumber() + 1)
                .pageSize(employeePage.getSize())
                .totalPages(employeePage.getTotalPages())
                .totalElements(employeePage.getTotalElements())
                .isLastPage(employeePage.isLast())
                .build();
    }

    @Override
    public Department getDepartmentOfManager(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = null;
        log.info("Instance of authentication: {}", authentication.getClass().toString());

        if(authentication instanceof JwtAuthenticationToken){
            Jwt jwt = (Jwt) authentication.getPrincipal();

            username = jwt.getSubject();
            log.info("Jwt subject: {}", username);
        }

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Employee manager = employeeRepository.findAllByAccount_AccountId(account.getAccountId());

        if(manager == null){
            throw new RuntimeException("Employee not found");
        }

        String position = manager.getPosition().getPositionName();
        log.info("Employee position: {}", position);

        boolean isManger = false;

        for(Role role : account.getRoles()){
            if(role.getName().equals("MANAGER")){
                isManger = true;
            }
        }

        if(!isManger){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Department dept = manager.getDepartment();
        log.info("Department: {}", dept.getDepartmentId());
        if(dept == null){
            throw new RuntimeException("Department not found");
        }

        return dept;
    }
}
