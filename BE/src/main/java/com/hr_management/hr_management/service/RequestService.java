package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.LeaveRequestDto;
import com.hr_management.hr_management.dto.response.LeaveRequestResponse;
import com.hr_management.hr_management.dto.response.RequestResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface RequestService {
    LeaveRequestResponse createLeaveRequest(LeaveRequestDto leaveRequestDto, JwtAuthenticationToken jwtAuthenticationToken);
}
