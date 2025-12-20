package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.LeaveTypeRequest;
import com.hr_management.hr_management.dto.response.LeaveBalanceResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface LeaveBalanceService {
    LeaveBalanceResponse filterLeaveDays(LeaveTypeRequest leaveTypeRequest, JwtAuthenticationToken jwtAuthenticationToken);

    void generateAnnualLeaveBalances();
}
