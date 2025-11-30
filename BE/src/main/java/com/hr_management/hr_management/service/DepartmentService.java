package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.DepartmentResponse;
import com.hr_management.hr_management.dto.response.DepartmentResponseDTO;

import java.util.List;

public interface DepartmentService {
    List<DepartmentResponse> getAllDepartments();
}
