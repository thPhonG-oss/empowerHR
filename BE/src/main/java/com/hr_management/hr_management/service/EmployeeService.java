package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;

import java.util.List;

public interface EmployeeService {
    EmployeeResponseDTO getEmployeeById(Integer employeeId);

    // [ Admin ]
    // 1. Xem danh sách nhân viên
    public List<EmployeeResponseDTO> getAll();

}
