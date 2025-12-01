package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.CheckInRequest;
import com.hr_management.hr_management.dto.request.CheckOutRequest;
import com.hr_management.hr_management.dto.response.CheckinCheckoutResponse;
import com.hr_management.hr_management.dto.response.CheckinResponse;
import com.hr_management.hr_management.dto.response.CheckoutResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface AttendanceService {
    CheckinResponse checkin(CheckInRequest checkInRequest, JwtAuthenticationToken jwtAuthenticationToken);
    CheckoutResponse checkout(CheckOutRequest checkOutRequest,JwtAuthenticationToken jwtAuthenticationToken);
    CheckinCheckoutResponse timeCheckinCheckout(JwtAuthenticationToken jwtAuthenticationToken);
}
