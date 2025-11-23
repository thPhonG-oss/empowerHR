package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.AccountCreationRequestDTO;
import com.hr_management.hr_management.dto.request.ChangePasswordRequest;
import com.hr_management.hr_management.dto.request.ConfimAccountRequest;
import com.hr_management.hr_management.dto.response.AccountResponseDTO;
import com.hr_management.hr_management.dto.response.ChangePasswordResponse;
import com.hr_management.hr_management.dto.response.ConfirmAccountResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface AccountService {
    ChangePasswordResponse changePassword (ChangePasswordRequest request, JwtAuthenticationToken jwtAuthenticationToken);
    ConfirmAccountResponse confirmAccount(ConfimAccountRequest request);

    void blockAccountByEmployeeId(Integer employeeId);
//    AccountResponseDTO createNewAccount(AccountCreationRequestDTO accountCreationRequestDTO);
}
