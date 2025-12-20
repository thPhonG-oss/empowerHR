package com.hr_management.hr_management.utils;

import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class JwtUtils {

    EmployeeRepository employeeRepository;
    AccountRepository accountRepository;


    public Integer getEmployeeIdFromAuthentication() {
        // Implementation to extract employee ID from JWT token
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

        Employee employee = employeeRepository.findAllByAccount_AccountId(account.getAccountId());

        if(employee == null){
            throw new AppException(ErrorCode.EMPLOYEE_NOT_FOUND);
        }

        return employee.getEmployeeId();
    }
}
