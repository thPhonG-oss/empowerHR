package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.AccountCreationRequestDTO;
import com.hr_management.hr_management.dto.response.AccountResponseDTO;

public interface AccountService {
    AccountResponseDTO createNewAccount(AccountCreationRequestDTO accountCreationRequestDTO);
}
