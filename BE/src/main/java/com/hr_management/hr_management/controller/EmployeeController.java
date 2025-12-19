package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.*;
import com.hr_management.hr_management.dto.response.*;
import com.hr_management.hr_management.repository.LeaveRequestRepository;
import com.hr_management.hr_management.repository.LeaveTypeRepository;
import com.hr_management.hr_management.service.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/v1/employees")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {

    private final EmployeeService employeeService;
    private final AuthenticationService authenticationService;
    private final RequestService requestService;
    AttendanceService attendanceService;
    LeaveBalanceService leaveBalanceService;
    LeaveTypeService leaveTypeService;
    private final RunningActivityService runningActivityService;

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
    @PostMapping("/filter-leave-days")
    public ApiResponse<LeaveBalanceResponse> filterLeaveDays( @RequestBody LeaveTypeRequest leaveTypeRequest,JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<LeaveBalanceResponse>builder()
                .result(leaveBalanceService.filterLeaveDays(leaveTypeRequest,jwtAuthenticationToken))
                .build();
    }
    @GetMapping("/leave-type")
    public ApiResponse<List<LeaveTypeResponse>> getAll( ){
        return ApiResponse.<List<LeaveTypeResponse>>builder()
                .result(leaveTypeService.getAll())
                .build();
    }
    @GetMapping("/time-checkin-checkout")
    public ApiResponse<CheckinCheckoutResponse>timeCheckinCheckout(JwtAuthenticationToken jwtAuthenticationToken){
        return ApiResponse.<CheckinCheckoutResponse>builder()
                .result(attendanceService.timeCheckinCheckout(jwtAuthenticationToken))
                .build();
    }
    @GetMapping("/attendances")
    public ApiResponse<List<AttendanceResponse>> getAllAttendance(JwtAuthenticationToken jwtAuthenticationToken){
        return  ApiResponse.<List<AttendanceResponse>>builder()
                .result(attendanceService.getAll(jwtAuthenticationToken))
                .build();
    }

    // Xem danh sách hoạt động đã đăng ký
    @Operation(
            summary = "Get Registered Activities for Employee",
            description = "API for employees to retrieve the list of activities they have registered for."
    )
    @GetMapping("/{employeeId}/activities")
    public ResponseEntity<ApiResponse<List<RunningActivityResponseDTO>>> getRegisteredActivities(@PathVariable Integer employeeId) {

        return ResponseEntity.ok(
                ApiResponse.<List<RunningActivityResponseDTO>>builder()
                        .message("Registered activities retrieved successfully")
                        .result(employeeService.getRegisteredActivitiesByEmployee(employeeId))
                        .build()
        );
    }
}