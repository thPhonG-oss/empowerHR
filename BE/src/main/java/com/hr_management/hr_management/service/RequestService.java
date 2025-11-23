package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.RequestResponseDTO;

import java.util.List;

public interface RequestService {
    List<RequestResponseDTO> getAllRequests();

    RequestResponseDTO getRequestById(Integer id);
}
