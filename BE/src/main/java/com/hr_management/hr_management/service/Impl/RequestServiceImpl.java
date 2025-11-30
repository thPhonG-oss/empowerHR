package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.LeaveRequestDto;
import com.hr_management.hr_management.dto.request.TimeSheetRequestDto;
import com.hr_management.hr_management.dto.response.LeaveRequestResponse;
import com.hr_management.hr_management.dto.response.TimeSheetResponse;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.LeaveRequestMapper;
import com.hr_management.hr_management.mapper.TimeSheetUpdateMapper;
import com.hr_management.hr_management.repository.AttendanceRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.LeaveTypeRepository;
import com.hr_management.hr_management.repository.RequestRepository;
import com.hr_management.hr_management.service.RequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestServiceImpl implements RequestService {

    EmployeeRepository employeeRepository;
    RequestRepository requestRepository;
    LeaveTypeRepository leaveTypeRepository;
    LeaveRequestMapper leaveRequestMapper;
    TimeSheetUpdateMapper timeSheetUpdateMapper;
    AttendanceRepository attendanceRepository;

    @Override
    public LeaveRequestResponse createLeaveRequest(LeaveRequestDto leaveRequestDto, JwtAuthenticationToken jwtAuthenticationToken) {
        if(!(leaveRequestDto.getRequest_type().equals("LeaveRequest")))
            throw  new AppException(ErrorCode.INCORRECT_REQUEST_TYPE);
        if(!(leaveTypeRepository.findById(leaveRequestDto.getLeaveTypeId()).get().getTotalDay() >0))
            throw  new AppException(ErrorCode.LEAVE_REQUEST_EXPIRED);
        LeaveRequest newLeaveRequest=leaveRequestMapper.toLeaveRequest(leaveRequestDto);
        setupBaseRequest(newLeaveRequest,jwtAuthenticationToken);
        newLeaveRequest.setLeaveType(leaveTypeRepository.findById(leaveRequestDto.getLeaveTypeId()).get());
        return leaveRequestMapper.toLeaveRequestResponse(requestRepository.save(newLeaveRequest));
    }

    @Override
    public TimeSheetResponse createTimeSheetRequest(TimeSheetRequestDto timeSheetRequestDto, JwtAuthenticationToken jwtAuthenticationToken) {
        if(!(timeSheetRequestDto.getRequest_type().equals("TimeSheetUpdateRequest")))
            throw  new AppException(ErrorCode.INCORRECT_REQUEST_TYPE);
        if(timeSheetRequestDto.getAttendanceDate()==null || timeSheetRequestDto.getCheckoutTime()==null || timeSheetRequestDto.getCheckinTime()==null)
            throw new AppException(ErrorCode.TIM_NULL_ERROR);
        Integer employeeId=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get().getEmployeeId();
        if(timeSheetRequestDto.getAttendanceDate().isAfter(LocalDate.now()))
            throw new AppException(ErrorCode.TIME_ERROR);
        Attendance attendance=attendanceRepository.findByEmployee_EmployeeIdAndAttendanceDate(employeeId,timeSheetRequestDto.getAttendanceDate())
                .orElseThrow(()->new AppException(ErrorCode.EMPTY_ATTENDANCE));
        if(timeSheetRequestDto.getAttendanceDate().isEqual(LocalDate.now()))
        {
            if(timeSheetRequestDto.getCheckinTime().isAfter(LocalTime.now())
                    || timeSheetRequestDto.getCheckoutTime().isAfter(LocalTime.now())){
                throw  new AppException(ErrorCode.TIME_ERROR);}
            if(attendance.getCheckinTime()==null||attendance.getCheckoutTime()==null)
                throw new AppException(ErrorCode.TIM_NULL_ERROR);

        }


        TimesheetUpdateRequest newTimeSheetRequest=timeSheetUpdateMapper.toTimeSheetUpdateRequest(timeSheetRequestDto);
        setupBaseRequest(newTimeSheetRequest,jwtAuthenticationToken);
        return timeSheetUpdateMapper.toTimeSheetResponse(requestRepository.save(newTimeSheetRequest));
    }
    private <T extends Request>T setupBaseRequest(T requestEntity,JwtAuthenticationToken jwtAuthenticationToken) {
        Employee employeeRequest=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        requestEntity.setEmployee(employeeRequest);
        requestEntity.setSubmitAt(LocalDateTime.now());
        return requestEntity;
    }
}
