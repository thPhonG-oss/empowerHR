package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.CheckInRequest;
import com.hr_management.hr_management.dto.request.CheckOutRequest;
import com.hr_management.hr_management.dto.response.AttendanceResponse;
import com.hr_management.hr_management.dto.response.CheckinCheckoutResponse;
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

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

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
        Duration duration = Duration.between(attendance.getCheckinTime(),attendance.getCheckoutTime());
        long workingHours = duration.toHours();
        attendance.setWorkingHours(workingHours);
        return attendanceMapper.toCheckoutResponse(attendanceRepository.save(attendance));
    }

    @Override
    public CheckinCheckoutResponse timeCheckinCheckout(JwtAuthenticationToken jwtAuthenticationToken) {
        Employee employee=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        Optional<Attendance> attendanceOptional=attendanceRepository.findByEmployee_EmployeeIdAndAttendanceDate(employee.getEmployeeId(),LocalDate.now());
        Attendance attendance;
        if(attendanceOptional.isPresent()){
            attendance=attendanceOptional.get();
        }else{
            attendance = new Attendance();
            attendance.setEmployee(employee);
        }
        return attendanceMapper.toCheckinCheckoutResponse(attendance);
    }

    @Override
    public List<AttendanceResponse> getAll(JwtAuthenticationToken jwtAuthenticationToken) {
        Employee employee=employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        return attendanceMapper.toAttendanceResponse(attendanceRepository.findAllByEmployee_EmployeeId(employee.getEmployeeId()));
    }
}
