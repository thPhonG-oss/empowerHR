package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.AccountCreationRequestDTO;
import com.hr_management.hr_management.dto.response.AccountResponseDTO;
import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.Role;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.AccountMapper;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.RoleRepository;
import com.hr_management.hr_management.service.AccountService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountServiceImpl implements AccountService {
    AccountRepository accountRepository;
    EmployeeRepository employeeRepository;
    RoleRepository roleRepository;
    AccountMapper accountMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public AccountResponseDTO createNewAccount(AccountCreationRequestDTO accountCreationRequestDTO){

        Employee existingEmployee = employeeRepository.findById(accountCreationRequestDTO.getEmployeeId())
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        if(existingEmployee.getAccount().getAccountId() != null){
            throw new AppException(ErrorCode.EMPLOYEE_ALREADY_HAS_ACCOUNT);
        }

        Set<Role> roles = new HashSet<>();

        Set<String> roleNames = accountCreationRequestDTO.getRoles();
        if(roleNames != null && !roleNames.isEmpty()){

            log.info("Roles: {}", roleNames);

            for(String roleName : roleNames){
                log.info("Role: {}", roleName);
                if(!roleRepository.existsByName(roleName)) {
                    throw new AppException(ErrorCode.ROLE_NOT_FOUND);
                }
                else{
                    roles = roleNames.stream().map((role) -> {
                        return roleRepository.findByName(role)
                                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                    }).collect(Collectors.toSet());
                }
            }
        }

        Account newAccount = new Account();
        newAccount.setUsername(existingEmployee.getEmployeeCode());
        newAccount.setPassword(passwordEncoder.encode(existingEmployee.getEmployeeCode()));
        newAccount.setCreatedAt(LocalDateTime.now());
        newAccount.setUpdatedAt(LocalDateTime.now());
        newAccount.setRoles(roles);

        existingEmployee.setAccount(newAccount);
        employeeRepository.save(existingEmployee);

        AccountResponseDTO response = accountMapper.toAccountResponseDTO(newAccount);
        response.setEmployeeId(existingEmployee.getEmployeeId());

        Account savedAccount = accountRepository.save(newAccount);
        response.setAccountId(savedAccount.getAccountId());

        return response;
    }
}
