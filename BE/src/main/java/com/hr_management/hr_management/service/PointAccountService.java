package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.PointAccountResponse;
import com.hr_management.hr_management.dto.response.PointAccountResponseDTO;

import java.util.List;

public interface PointAccountService {
    PointAccountResponseDTO createNewPointAccount();
    List<PointAccountResponse> getAllPointAccounts();
}
