package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.RequestResponseDTO;
import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;

import java.util.List;

public interface RequestService {
    List<RequestResponseDTO> getAllRequests();

    RequestResponseDTO getRequestById(Integer id);

    HandledRequestResponseDTO getAllHandledRequest(int pageSize, int pageNumber);
}
