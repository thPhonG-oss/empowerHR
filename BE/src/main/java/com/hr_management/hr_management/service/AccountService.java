package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.ChangePasswordRequest;
import com.hr_management.hr_management.dto.request.ConfimAccountRequest;
import com.hr_management.hr_management.dto.response.ChangePasswordResponse;
import com.hr_management.hr_management.dto.response.ConfirmAccountResponse;

public interface AccountService {
    ChangePasswordResponse changePassword (ChangePasswordRequest request);
    ConfirmAccountResponse confirmAccount(ConfimAccountRequest request);
}
