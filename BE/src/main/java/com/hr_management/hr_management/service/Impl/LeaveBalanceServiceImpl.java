package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.LeaveTypeRequest;
import com.hr_management.hr_management.dto.response.LeaveBalanceResponse;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.mapper.LeaveBalanceMapper;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.LeaveBalanceRepository;
import com.hr_management.hr_management.repository.LeaveTypeRepository;
import com.hr_management.hr_management.service.LeaveBalanceService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LeaveBalanceServiceImpl implements LeaveBalanceService {
    LeaveTypeRepository leaveTypeRepository;
    LeaveBalanceRepository leaveBalanceRepository;
    EmployeeRepository employeeRepository;
    LeaveBalanceMapper leaveBalanceMapper;

    @Override
    public LeaveBalanceResponse filterLeaveDays(LeaveTypeRequest leaveTypeRequest, JwtAuthenticationToken jwtAuthenticationToken) {
        Employee employee = employeeRepository.findByAccount_Username(jwtAuthenticationToken.getName()).get();
        return leaveBalanceMapper.toLeaveBalanceResponse(leaveBalanceRepository.findByEmployee_EmployeeIdAndLeaveType_LeaveTypeIdAndYear(employee.getEmployeeId(), leaveTypeRequest.getLeaveTypeId(), LocalDate.now().getYear()));
    }
}
