package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.AttendanceResponse;
import com.hr_management.hr_management.dto.response.LeaveBalanceResponse;
import com.hr_management.hr_management.entity.LeaveBalance;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LeaveBalanceMapper {
    LeaveBalanceResponse toLeaveBalanceResponse(LeaveBalance leaveBalance);
}
