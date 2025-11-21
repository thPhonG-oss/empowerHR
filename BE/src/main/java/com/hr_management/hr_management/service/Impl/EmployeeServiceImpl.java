package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.controller.EmployeeController;
import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;

import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.request.GetAllEmployeeDepartmentRequest;
import com.hr_management.hr_management.dto.response.EmployeeCreationResponseDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.GetAllEmployeeDepartmentResponse;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.EmployeeMapper;
import com.hr_management.hr_management.repository.*;
import com.hr_management.hr_management.service.EmployeeService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;


import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeServiceImpl implements EmployeeService {

    EmployeeRepository employeeRepository;
    DepartmentRepository departmentRepository;
    JobPositonRepository jobPositonRepository;
    EmployeeMapper employeeMapper;
    BankRepository bankRepository;
    AccountRepository accountRepository;
    RoleRepository roleRepository;
//    AccountRepository accountRepository;


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

        employeeMapper.updateEmployeeProfile(employee, request);
        employeeRepository.save(employee);
        return employeeMapper.ToEmployeeResponseDTO(employee);
    }

    @Transactional
    @Override
    public EmployeeCreationResponseDTO updateEmloyeeProfileByEmployeeId(Integer employeeId, EmployeeUpdateRequestDTO employeeUpdateRequestDTO){
        Employee existingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        if(employeeUpdateRequestDTO.getIdentityCard() != null){
            if(employeeRepository.existsByIdentityCard(employeeUpdateRequestDTO.getIdentityCard()) || employeeRepository.existsByEmail(employeeUpdateRequestDTO.getEmail())){
                throw new AppException(ErrorCode.EMPLOYEE_ALREADY_EXISTS);
            }
        }

        Bank bank = existingEmployee.getBank();
        if(!bankRepository.findById(bank.getBankId()).isPresent()){
            throw new AppException(ErrorCode.BANK_ACCOUNT_NOT_FOUND);
        }

        if(bankRepository.existsByBankAccountNumber(employeeUpdateRequestDTO.getBankAccountNumber()) && bankRepository.existsByBankName(employeeUpdateRequestDTO.getBankName())){
            throw new AppException(ErrorCode.BANK_ACCOUNT_ALREADY_EXISTS);
        }

        bank.setBankName(employeeUpdateRequestDTO.getBankName());
        bank.setBranch(employeeUpdateRequestDTO.getBankBranch());
        bank.setBankAccountNumber(employeeUpdateRequestDTO.getBankAccountNumber());
        bank.setUpdatedAt(LocalDateTime.now());
        Bank savedBank = bankRepository.save(bank);

        existingEmployee.setBank(savedBank);

        Department existingDepartment = departmentRepository.findById(employeeUpdateRequestDTO.getDepartmentId())
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        Position existingPosition = jobPositonRepository.findById(employeeUpdateRequestDTO.getPositionId())
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POSITION_NOT_FOUND));

        existingEmployee.setEmployeeName(employeeUpdateRequestDTO.getEmployeeName());
        existingEmployee.setAddress(employeeUpdateRequestDTO.getAddress());
        existingEmployee.setEmail(employeeUpdateRequestDTO.getEmail());
        existingEmployee.setPhoneNumber(employeeUpdateRequestDTO.getPhoneNumber());
        existingEmployee.setIsActive(employeeUpdateRequestDTO.getIsActive());
        existingEmployee.setUpdatedAt(LocalDateTime.now());
        existingEmployee.setTaxCode(employeeUpdateRequestDTO.getTaxCode());
        existingEmployee.setDepartment(existingDepartment);
        existingEmployee.setPosition(existingPosition);


        return employeeMapper.ToEmployeeProfileCreationRequestDTO(employeeRepository.save(existingEmployee));
    }

    @Transactional
    @Override
    public EmployeeCreationResponseDTO createNewEmployeeProfile(EmployeeProfileCreationRequestDTO request){

        if(employeeRepository.existsByIdentityCard(request.getIdentityCard()) || employeeRepository.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.EMPLOYEE_ALREADY_EXISTS);
        }

        if(bankRepository.existsByBankAccountNumber(request.getBankAccountNumber()) && bankRepository.existsByBankName(request.getBankName())){
            throw new AppException(ErrorCode.BANK_ACCOUNT_ALREADY_EXISTS);
        }

        Department existingDepartment = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        Position existingPosition = jobPositonRepository.findById(request.getPositionId())
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POSITION_NOT_FOUND));

        Bank bank = Bank.builder()
                .bankName(request.getBankName())
                .branch(request.getBankBranch())
                .bankAccountNumber(request.getBankAccountNumber())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        Bank savedBank = bankRepository.save(bank);


        Employee employee = Employee.builder()
                .employeeName(request.getEmployeeName())
                .identityCard(request.getIdentityCard())
                .address(request.getAddress())
                .email(request.getEmail())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .startingDate(LocalDate.now())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .taxCode(request.getTaxCode())
                .position(existingPosition)
                .department(existingDepartment)
                .bank(savedBank)
                .build();

        Employee savedEmployee = employeeRepository.save(employee);

        String employeeCode = generateEmployeeCode(savedEmployee.getEmployeeId());

        savedEmployee.setEmployeeCode(employeeCode);

        if(accountRepository.existsByUsername(employeeCode)){
            throw new AppException(ErrorCode.EMPLOYEE_ALREADY_HAS_ACCOUNT);
        }

        Set<Role> roles = new HashSet<>();

        Set<String> roleNames = request.getRoles();
        if (roleNames != null && !roleNames.isEmpty()) {

            log.info("Roles: {}", roleNames);

            for (String roleName : roleNames) {
                log.info("Role: {}", roleName);
                if (!roleRepository.existsByName(roleName)) {
                    throw new AppException(ErrorCode.ROLE_NOT_FOUND);
                } else {
                    roles = roleNames.stream().map((role) -> {
                        return roleRepository.findByName(role)
                                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                    }).collect(Collectors.toSet());
                }
            }
        }

        Account newAccount = Account.builder()
                .username(employeeCode)
                .password(employeeCode)
                .roles(roles)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();


        Account savedAccount = accountRepository.save(newAccount);
        savedEmployee.setAccount(savedAccount);

        return employeeMapper.ToEmployeeProfileCreationRequestDTO(employeeRepository.save(savedEmployee));
    }


    @Override
    public String generateEmployeeCode(Integer employeeId) {
        return String.format("NV%05d", employeeId);
    }

    @Override
    public GetAllEmployeeDepartmentResponse getAllEmployeeDepartment(GetAllEmployeeDepartmentRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        Optional<Account> account=accountRepository.findByUsername(jwtAuthenticationToken.getName());
        Employee employee=employeeRepository.findAllByAccount_AccountId(account.get().getAccountId());
        if(!(request.getDepartmentId().equals(employee.getDepartment().getDepartmentId())))
                throw new AppException(ErrorCode.NOT_VIEW_OTHER_DEPARTMENT);
        List<Employee> employees=employeeRepository.findAllByDepartment_DepartmentId(request.getDepartmentId());
        return GetAllEmployeeDepartmentResponse.builder()
                .allEmployee(employees.stream().map(employeeMapper::toEmployeeResponse).toList())
                .build();
    }
}
