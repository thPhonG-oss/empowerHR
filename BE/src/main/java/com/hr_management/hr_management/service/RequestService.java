package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.LeaveRequestDto;
import com.hr_management.hr_management.dto.request.TimeSheetRequestDto;
import com.hr_management.hr_management.dto.response.LeaveRequestResponse;
import com.hr_management.hr_management.dto.response.RequestResponse;
import com.hr_management.hr_management.dto.response.TimeSheetResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface RequestService {
    LeaveRequestResponse createLeaveRequest(LeaveRequestDto leaveRequestDto, JwtAuthenticationToken jwtAuthenticationToken);
    TimeSheetResponse createTimeSheetRequest(TimeSheetRequestDto timeSheetRequestDto,JwtAuthenticationToken jwtAuthenticationToken);
    HandledRequestResponseDTO getAllHandledRequests(Integer pageNumber, Integer pageSize);

    Department getDepartmentOfManager();
    RequestResponseDTO handleRequest(RequestHandleDTO requestHandleDTO, Integer requestId);
    RequestResponseDTO getRequestById(Integer requestId);
}
