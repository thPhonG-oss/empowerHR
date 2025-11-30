package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.LeaveRequestDto;
import com.hr_management.hr_management.dto.response.LeaveRequestResponse;
import com.hr_management.hr_management.dto.response.RequestResponse;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.LeaveRequest;
import com.hr_management.hr_management.entity.Request;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.LeaveRequestMapper;
import com.hr_management.hr_management.mapper.RequestMapper;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.LeaveRequestRepository;
import com.hr_management.hr_management.repository.LeaveTypeRepository;
import com.hr_management.hr_management.repository.RequestRepository;
import com.hr_management.hr_management.service.RequestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestServiceImpl implements RequestService {
    RequestMapper requestMapper;
    LeaveRequestRepository leaveRequestRepository;
    EmployeeRepository employeeRepository;
    RequestRepository requestRepository;
    LeaveRequestMapper leaveRequestMapper;
    LeaveTypeRepository leaveTypeRepository;

    @Override
    public LeaveRequestResponse createLeaveRequest(LeaveRequestDto leaveRequestDto, JwtAuthenticationToken jwtAuthenticationToken) {
        if(!(leaveRequestDto.getRequest_type().equals("LeaveRequest")))
            throw  new AppException(ErrorCode.INCORRECT_REQUEST_TYPE);
        if(!(leaveTypeRepository.findById(leaveRequestDto.getLeaveTypeId()).get().getTotalDay() >0))
            throw  new AppException(ErrorCode.LEAVE_REQUEST_EXPIRED);
        Employee employeeRequest=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        LeaveRequest newLeaveRequest=leaveRequestMapper.toLeaveRequest(leaveRequestDto);
        newLeaveRequest.setEmployee(employeeRequest);
        newLeaveRequest.setSubmitAt(LocalDateTime.now());
        newLeaveRequest.setLeaveType(leaveTypeRepository.findById(leaveRequestDto.getLeaveTypeId()).get());
        return leaveRequestMapper.toLeaveRequestResponse(requestRepository.save(newLeaveRequest));
    }
}
