package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.ChangePasswordRequest;
import com.hr_management.hr_management.dto.request.ConfimAccountRequest;
import com.hr_management.hr_management.dto.response.ChangePasswordResponse;
import com.hr_management.hr_management.dto.response.ConfirmAccountResponse;
import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.AccountMapper;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.service.AccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountServiceImpl implements AccountService {
    AccountRepository accountRepository;
    PasswordEncoder passwordEncoder;
    AccountMapper accountMapper;
    @Override
    public ChangePasswordResponse changePassword(ChangePasswordRequest request) {
        Optional<Account> account=accountRepository.findByUsername(request.getUserName());
        if(account.isEmpty()) throw new AppException(ErrorCode.ACCOUNT_NOT_EXITS);
        account.get().setPassword(request.getNewpassword());
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
}
