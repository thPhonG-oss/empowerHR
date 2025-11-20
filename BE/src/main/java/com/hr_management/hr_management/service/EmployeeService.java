package com.hr_management.hr_management.service;
import java.util.List;
import java.util.Optional;

import com.hr_management.hr_management.dto.response.EmployeeResponse;
import com.hr_management.hr_management.entity.Employee;

public interface EmployeeService {


    // [ Admin ]
    // 1. Xem danh sách nhân viên
    public List<EmployeeResponse> getAll();

    // [ Manager ]
    // 1. Xem chi tiết hồ sơ nhân viên tại phòng ban mình quản lý
    EmployeeResponse getEmployeeById(Integer employeeId);

    // [ Employee ]
    // 1. Xem hồ sơ cá nhân
    // 2. Cập nhật thông tin cá nhân
}
