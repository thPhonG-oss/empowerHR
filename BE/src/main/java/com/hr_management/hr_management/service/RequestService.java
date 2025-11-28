package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.RequestResponseDTO;

public interface RequestService {
    RequestResponseDTO getRequestById(Integer requestId);
}
