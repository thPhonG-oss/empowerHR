package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;
import com.hr_management.hr_management.entity.Department;

public interface RequestService {

    HandledRequestResponseDTO getAllHandledRequests(Integer pageNumber, Integer pageSize);

    Department getDepartmentOfManager();
}
