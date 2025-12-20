package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.UpdateEmployeeProfileRequest;
import com.hr_management.hr_management.dto.response.*;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.Role;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;
import java.util.Set;

import com.hr_management.hr_management.dto.request.EmployeeProfileCreationRequestDTO;
import com.hr_management.hr_management.dto.request.EmployeeUpdateRequestDTO;
import com.hr_management.hr_management.dto.request.GetAllEmployeeDepartmentRequest;
import jakarta.transaction.Transactional;


public interface EmployeeService {
    EmployeeResponseDTO getEmployeeById(Integer employeeId);


    EmployeeResponseDTO getEmployeeByUserName(String username);

    // [ Admin ]
    // 1. Xem danh sách nhân viên
    public List<EmployeeResponseDTO> getAll();

    // [ Employee ]
    // 1. Xem hồ sơ cá nhân
    // 2. Cập nhật thông tin cá nhân
    EmployeeResponseDTO updateEmployeeProfileByUsername(String username, UpdateEmployeeProfileRequest request);

    @Transactional
    EmployeeCreationResponseDTO updateEmloyeeProfileByEmployeeId(Integer employeeId, EmployeeUpdateRequestDTO employeeUpdateRequestDTO);

    @Transactional
    EmployeeCreationResponseDTO createNewEmployeeProfile(EmployeeProfileCreationRequestDTO request);

    String generateEmployeeCode(Integer employeeId);
    GetAllEmployeeDepartmentResponse getAllEmployeeDepartment(GetAllEmployeeDepartmentRequest request, JwtAuthenticationToken jwtAuthenticationToken);

    // update thêm function lấy tất cả thông tin của employee (bao gồm cả thông tin bank, account, department, position)
    EmployeeCreationResponseDTO getFullEmployeeInfo(Integer employeeId);

    Set<Role> transformRole(Set<String> roleNames);

    @Transactional
    Employee createDefaultMangerProfile(EmployeeProfileCreationRequestDTO request);

    // Lay danh sach hoat dong da dang ky cua mot nhan vien
    List<RunningActivityResponseDTO> getRegisteredActivitiesByEmployee(Integer employeeId);

    ParticipateInDetailsResponseDTO getActivityDetailsForEmployee(Integer employeeId, Integer activityId);
}
