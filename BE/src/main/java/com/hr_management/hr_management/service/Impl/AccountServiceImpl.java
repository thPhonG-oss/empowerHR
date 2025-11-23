package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.dto.request.ChangePasswordRequest;
import com.hr_management.hr_management.dto.request.ConfimAccountRequest;
import com.hr_management.hr_management.dto.response.ChangePasswordResponse;
import com.hr_management.hr_management.dto.response.ConfirmAccountResponse;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.AccountMapper;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.RoleRepository;
import com.hr_management.hr_management.service.AccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountServiceImpl implements AccountService {
    AccountRepository accountRepository;
    EmployeeRepository employeeRepository;
    RoleRepository roleRepository;

//    @Autowired
//    PasswordEncoder passwordEncoder;
    PasswordEncoder passwordEncoder;
    AccountMapper accountMapper;
    @Override
    public ChangePasswordResponse changePassword(ChangePasswordRequest request, JwtAuthenticationToken jwtAuthenticationToken) {
        Optional<Account> account=accountRepository.findByUsername(request.getUserName());
        if(account.isEmpty()) throw new AppException(ErrorCode.ACCOUNT_NOT_EXITS);
        if(!(request.getUserName().equals(jwtAuthenticationToken.getName()))) throw new AppException(ErrorCode.NOT_CHANGE_PASSWORD);
        account.get().setPassword(passwordEncoder.encode(request.getNewpassword()));
        return accountMapper.toChangePasswordResponse(accountRepository.save(account.get()));
    }

    @Override
    public ConfirmAccountResponse confirmAccount(ConfimAccountRequest request) {

        Optional<Account> account=accountRepository.findByUsername(request.getUserName());
        if(account.isEmpty()) throw new AppException(ErrorCode.ACCOUNT_NOT_EXITS);
        return ConfirmAccountResponse.builder()
                .isValid(passwordEncoder.matches(request.getPassword(), account.get().getPassword()))
                .build();
    }

    @Override
    public void blockAccountByEmployeeId(Integer employeeId){
        Employee existingEmployee=employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        Account account = accountRepository.findById(existingEmployee.getAccount().getAccountId())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));

        boolean currentStatus = account.isAccountStatus();
        account.setAccountStatus(currentStatus == true ? false : true);

        accountRepository.save(account);
    }
}
