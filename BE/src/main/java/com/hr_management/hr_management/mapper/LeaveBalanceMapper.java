package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.LeaveBalanceResponse;
import com.hr_management.hr_management.entity.LeaveBalance;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LeaveBalanceMapper {
    LeaveBalanceResponse toLeaveBalanceResponse(LeaveBalance leaveBalance);
}
