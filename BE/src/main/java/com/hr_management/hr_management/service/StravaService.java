package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.StravaConnectionsResponseDTO;
import com.hr_management.hr_management.dto.response.StravaTokenResponseDTO;
import jakarta.transaction.Transactional;

public interface StravaService {
    String getAuthorizationUrl();

    @Transactional
    StravaConnectionsResponseDTO connectStravaAccount(String code, String state);
}
