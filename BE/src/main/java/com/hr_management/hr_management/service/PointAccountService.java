package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.PointAccountResponse;
import com.hr_management.hr_management.dto.response.PointAccountResponseDTO;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface PointAccountService {
    PointAccountResponseDTO createNewPointAccount();
    List<PointAccountResponse> getAllPointAccounts();
    PointAccountResponse getMyPointAccounts(String username);
}
