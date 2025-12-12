package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.CheckInRequest;
import com.hr_management.hr_management.dto.request.CheckOutRequest;
import com.hr_management.hr_management.dto.response.CheckinResponse;
import com.hr_management.hr_management.dto.response.CheckoutResponse;
import com.hr_management.hr_management.entity.Attendance;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.AttendanceMapper;
import com.hr_management.hr_management.repository.AttendanceRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.service.AttendanceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AttendanceServiceImpl implements AttendanceService {
    AttendanceMapper attendanceMapper;
    AttendanceRepository attendanceRepository;
    EmployeeRepository employeeRepository;
    @Override
    public CheckinResponse checkin(CheckInRequest checkInRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        Attendance attendance=attendanceMapper.toAttendance(checkInRequest);
        Employee employee=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        if(!(attendanceRepository.findByEmployee_EmployeeIdAndAttendanceDate(employee.getEmployeeId(), LocalDate.now()).isEmpty()))
            throw new AppException(ErrorCode.CHECKIN_ERROR);
        attendance.setEmployee(employee);

        return attendanceMapper.toCheckinResponse(attendanceRepository.save(attendance));
    }

    @Override
    public CheckoutResponse checkout(CheckOutRequest checkOutRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        Employee employee=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        Attendance attendance=attendanceRepository.findByEmployee_EmployeeIdAndAttendanceDate(employee.getEmployeeId(),LocalDate.now())
                .orElseThrow(()->new AppException(ErrorCode.NOT_CHECKIN));
        if(!(attendance.getCheckoutTime()==null))
            throw  new AppException(ErrorCode.CHECKOUT_ERROR);
        attendance.setCheckoutTime(LocalTime.now());
        attendance.setIpCheckout(checkOutRequest.getIpCheckout());
        attendance.setCheckoutLocationStatus(checkOutRequest.getCheckoutLocationStatus());
        return attendanceMapper.toCheckoutResponse(attendanceRepository.save(attendance));
    }
}
