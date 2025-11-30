package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.dto.response.RequestResponseDTO;

public interface RequestService {

    HandledRequestResponseDTO getAllHandledRequests(Integer pageNumber, Integer pageSize);

    Department getDepartmentOfManager();
     RequestResponseDTO handleRequest(RequestHandleDTO requestHandleDTO, Integer requestId);
}
