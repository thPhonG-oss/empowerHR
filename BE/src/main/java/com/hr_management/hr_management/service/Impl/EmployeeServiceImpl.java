package com.hr_management.hr_management.service.Impl;

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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;


import java.util.List;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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
    PasswordEncoder passwordEncoder;
    PointAccountRepository pointAccountRepository;


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
        employeeResponseDTO.setBankAccountNumber(existingEmployee.getBank().getBankAccountNumber());
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
                    dto.setBankAccountNumber(emp.getBank().getBankAccountNumber());
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

        // check identity
        if(employeeUpdateRequestDTO.getIdentityCard() != null && !employeeUpdateRequestDTO.getIdentityCard().equals(existingEmployee.getIdentityCard())){
            if(employeeRepository.existsByIdentityCardAndEmployeeIdNot(employeeUpdateRequestDTO.getIdentityCard(), employeeId)){
                throw new IllegalArgumentException("CCCD " + employeeUpdateRequestDTO.getIdentityCard() + " đã tồn tại.");
            }
        }

        // check email
        if(employeeUpdateRequestDTO.getEmail() != null && !employeeUpdateRequestDTO.getEmail().equals(existingEmployee.getEmail())){
            if(employeeRepository.existsByEmailAndEmployeeIdNot(employeeUpdateRequestDTO.getEmail(), employeeId)){
                throw new IllegalArgumentException("Email " + employeeUpdateRequestDTO.getEmail() + " đã được sử dụng bởi một nhân viên khác.");
            }
        }

        // check isActive
        if(employeeUpdateRequestDTO.getIsActive() != null && !employeeUpdateRequestDTO.getIsActive().equals(existingEmployee.getIsActive())){
            existingEmployee.setIsActive(employeeUpdateRequestDTO.getIsActive());
        }

        existingEmployee.setEmployeeName(employeeUpdateRequestDTO.getEmployeeName());
        existingEmployee.setIdentityCard(employeeUpdateRequestDTO.getIdentityCard());
        existingEmployee.setEmail(employeeUpdateRequestDTO.getEmail());
        existingEmployee.setAddress(employeeUpdateRequestDTO.getAddress());
        existingEmployee.setGender(employeeUpdateRequestDTO.getGender());
        existingEmployee.setDateOfBirth(employeeUpdateRequestDTO.getDateOfBirth());
        existingEmployee.setPhoneNumber(employeeUpdateRequestDTO.getPhoneNumber());
        existingEmployee.setTaxCode(employeeUpdateRequestDTO.getTaxCode());

        // check department
        if(employeeUpdateRequestDTO.getDepartmentId() != null && !employeeUpdateRequestDTO.getDepartmentId().equals(existingEmployee.getDepartment().getDepartmentId())){
            Department dept = departmentRepository.findById(employeeUpdateRequestDTO.getDepartmentId())
                    .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

            existingEmployee.setDepartment(dept);
        }

        // check position
        if(employeeUpdateRequestDTO.getPositionId() != null && !employeeUpdateRequestDTO.getPositionId().equals(existingEmployee.getPosition().getPositionId())){
            Position pos = jobPositonRepository.findById(employeeUpdateRequestDTO.getPositionId())
                    .orElseThrow(() -> new AppException(ErrorCode.JOB_POSITION_NOT_FOUND));

            existingEmployee.setPosition(pos);
        }

        // check bank
        String incomingBankName = employeeUpdateRequestDTO.getBankName();
        String incomingBankAccountNumber = employeeUpdateRequestDTO.getBankAccountNumber();

        if(
                incomingBankName != null && !incomingBankName.isEmpty()
                && incomingBankAccountNumber != null && !incomingBankAccountNumber.isEmpty()
        ){
            Bank bank = existingEmployee.getBank();
            if(bank == null){

                if(bankRepository.existsByBankName(incomingBankName) && bankRepository.existsByBankAccountNumber(incomingBankAccountNumber)){
                    throw new AppException(ErrorCode.BANK_ACCOUNT_ALREADY_EXISTS);
                }

                bank = Bank.builder()
                        .bankName(incomingBankName)
                        .branch(employeeUpdateRequestDTO.getBankBranch())
                        .bankAccountNumber(incomingBankAccountNumber)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                existingEmployee.setBank(bank);
            } else{
                if(bankRepository.existsByBankAccountNumberAndBankIdNot(incomingBankAccountNumber, existingEmployee.getBank().getBankId())){
                    throw new IllegalArgumentException("Tài khoản " + incomingBankAccountNumber + " đã có người sử dụng.");
                }
               bank.setBankName(incomingBankName);
               bank.setBranch(employeeUpdateRequestDTO.getBankBranch());
               bank.setBankAccountNumber(incomingBankAccountNumber);
               bank.setUpdatedAt(LocalDateTime.now());
            }

            // check roles
            if(employeeUpdateRequestDTO.getRoles() != null && !employeeUpdateRequestDTO.getRoles().isEmpty()){
                Account acct = existingEmployee.getAccount();

                if(acct == null){
                    throw new AppException(ErrorCode.ACCOUNT_NOT_EXITS);
                }
                else {
                    Set<Role> roles = new HashSet<>();

                    Set<String> roleNames = employeeUpdateRequestDTO.getRoles();
                    if (roleNames != null && !roleNames.isEmpty()) {
                        roles = transformRole(roleNames);
                    }
                    acct.setRoles(roles);
                    acct.setUpdatedAt(LocalDateTime.now());
                }
            }
        }

        existingEmployee.setUpdatedAt(LocalDateTime.now());
        Employee updatedEmployee = employeeRepository.save(existingEmployee);

        return employeeMapper.toEmployeeCreationResponseDTO(updatedEmployee);
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

        PointAccount pointAccount = PointAccount.builder()
                .currentPoints(Long.valueOf(0))
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        // create employee
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
                .pointAccount(pointAccount)
                .build();


        Employee savedEmployee = employeeRepository.save(employee);

        // update point account with employee
        pointAccount.setEmployee(employee);
        pointAccountRepository.save(pointAccount);

        // generate employee code
        String employeeCode = generateEmployeeCode(savedEmployee.getEmployeeId());

        savedEmployee.setEmployeeCode(employeeCode);

        if(accountRepository.existsByUsername(employeeCode)){
            throw new AppException(ErrorCode.EMPLOYEE_ALREADY_HAS_ACCOUNT);
        }

        Set<Role> roles = new HashSet<>();

        Set<String> roleNames = request.getRoles();
        if (roleNames != null && !roleNames.isEmpty()) {
            roles = transformRole(roleNames);
        }

        Account newAccount = Account.builder()
                .username(employeeCode)
                .password(passwordEncoder.encode(employeeCode))
                .roles(roles)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();


        Account savedAccount = accountRepository.save(newAccount);
        savedEmployee.setAccount(savedAccount);

        return employeeMapper.toEmployeeCreationResponseDTO(employeeRepository.save(savedEmployee));
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

    // update thêm function lấy tất cả thông tin của employee (bao gồm cả thông tin bank, account, department, position)
    @Override
    public EmployeeCreationResponseDTO getFullEmployeeInfo(Integer employeeId){
        Employee existingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        return employeeMapper.toEmployeeCreationResponseDTO(existingEmployee);
    }

    @Override
    public Set<Role> transformRole(Set<String> roleNames){
        Set<Role> roles = new HashSet<>();
        for(String roleName:roleNames){
            log.info("Role: {}", roleName);
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            roles.add(role);
        }
        return roles;
    }

    @Transactional
    @Override
    public Employee createDefaultMangerProfile(EmployeeProfileCreationRequestDTO request){

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

        PointAccount pointAccount = PointAccount.builder()
                .currentPoints(Long.valueOf(0))
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        // create employee
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
                .pointAccount(pointAccount)
                .build();


        Employee savedEmployee = employeeRepository.save(employee);

        // update point account with employee
        pointAccount.setEmployee(employee);
        pointAccountRepository.save(pointAccount);

        // generate employee code
        String employeeCode = generateEmployeeCode(savedEmployee.getEmployeeId());

        savedEmployee.setEmployeeCode(employeeCode);

        if(accountRepository.existsByUsername(employeeCode)){
            throw new AppException(ErrorCode.EMPLOYEE_ALREADY_HAS_ACCOUNT);
        }

        Set<Role> roles = new HashSet<>();

        Set<String> roleNames = request.getRoles();
        if (roleNames != null && !roleNames.isEmpty()) {
            roles = transformRole(roleNames);
        }

        Account newAccount = Account.builder()
                .username(employeeCode)
                .password(passwordEncoder.encode(employeeCode))
                .roles(roles)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();


        Account savedAccount = accountRepository.save(newAccount);
        savedEmployee.setAccount(savedAccount);

        return employeeRepository.save(savedEmployee);
    }
}
