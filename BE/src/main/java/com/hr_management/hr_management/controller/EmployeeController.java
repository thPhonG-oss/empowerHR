package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.*;
import com.hr_management.hr_management.dto.response.*;
import com.hr_management.hr_management.repository.LeaveRequestRepository;
import com.hr_management.hr_management.service.AttendanceService;
import com.hr_management.hr_management.service.AuthenticationService;
import com.hr_management.hr_management.service.EmployeeService;
import com.hr_management.hr_management.service.RequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RequestMapping("api/v1/employee")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {

    private final EmployeeService employeeService;
    private final AuthenticationService authenticationService;
    private final RequestService requestService;
    AttendanceService attendanceService;

    // [ Employee ]
    // 1. Xem hồ sơ cá nhân

    @GetMapping("/profile")
    public ApiResponse<EmployeeResponseDTO> getMyProfile(JwtAuthenticationToken jwtToken){
        String username = jwtToken.getName();
        EmployeeResponseDTO profile = employeeService.getEmployeeByUserName(username);
        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(profile)
                .message("Profile retrieved successfully")
                .build();
    }
    // 2. Cập nhật thông tin cá nhân
    @PutMapping("/profile")
    public ApiResponse<EmployeeResponseDTO> updateMyProfile(JwtAuthenticationToken jwtToken, @RequestBody UpdateEmployeeProfileRequest request){
        String username = jwtToken.getName();
        EmployeeResponseDTO updatedProfile = employeeService.updateEmployeeProfileByUsername(username, request) ;

        return ApiResponse.<EmployeeResponseDTO>builder()
                .result(updatedProfile)
                .message("Profile updated successfully")
                .build();
    }

    // tạo leave request
    @PostMapping("/requests/leaves")
    public  ApiResponse<LeaveRequestResponse> createLeaveRequest(@RequestBody LeaveRequestDto leaveRequestDto,JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<LeaveRequestResponse>builder()
                .result(requestService.createLeaveRequest(leaveRequestDto,jwtAuthenticationToken))
                .build();
    }
    //tao update timesheet
    @PostMapping("/requests/timesheet")
    public ApiResponse<TimeSheetResponse> createTimeSheet(@RequestBody TimeSheetRequestDto timeSheetRequestDto, JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<TimeSheetResponse>builder()
                .result(requestService.createTimeSheetRequest(timeSheetRequestDto,jwtAuthenticationToken))
                .build();
    }
    @PostMapping("/checkin")
    public ApiResponse<CheckinResponse> checkin( @RequestBody CheckInRequest checkInRequest,JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<CheckinResponse>builder()
                .result(attendanceService.checkin(checkInRequest,jwtAuthenticationToken))
                .build();
    }
    @PostMapping("/checkout")
    public ApiResponse<CheckoutResponse> checkout( @RequestBody CheckOutRequest checkOutRequest,JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<CheckoutResponse>builder()
                .result(attendanceService.checkout(checkOutRequest,jwtAuthenticationToken))
                .build();
    }
}
