package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.LeaveRequestDto;
import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.dto.request.TimeSheetRequestDto;
import com.hr_management.hr_management.dto.response.*;
import com.hr_management.hr_management.entity.Department;
import com.hr_management.hr_management.enums.RequestStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface RequestService {
    LeaveRequestResponse createLeaveRequest(LeaveRequestDto leaveRequestDto, JwtAuthenticationToken jwtAuthenticationToken);
    TimeSheetResponse createTimeSheetRequest(TimeSheetRequestDto timeSheetRequestDto,JwtAuthenticationToken jwtAuthenticationToken);
    HandledRequestResponseDTO getAllHandledRequests(Integer pageNumber, Integer pageSize);
    Department getDepartmentOfManager();
    RequestResponseDTO handleRequest(RequestHandleDTO requestHandleDTO, Integer requestId);
    RequestResponseDTO getRequestById(Integer requestId);
    HandledRequestResponseDTO getMyRequests(Integer userId, Integer pageNumber, Integer pageSize, List<RequestStatus> status);

    // get all unresolved requests of the specific deparment
    HandledRequestResponseDTO getAllPendingRequests(Integer pageNumber, Integer pageSize);
}