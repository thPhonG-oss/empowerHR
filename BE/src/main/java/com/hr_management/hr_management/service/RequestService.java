package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.dto.response.RequestResponseDTO;

public interface RequestService {
    RequestResponseDTO handleRequest(RequestHandleDTO requestHandleDTO, Integer requestId);
}
