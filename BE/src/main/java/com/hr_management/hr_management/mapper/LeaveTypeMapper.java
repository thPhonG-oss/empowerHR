package com.hr_management.hr_management.mapper;


import com.hr_management.hr_management.dto.response.LeaveTypeResponse;
import com.hr_management.hr_management.entity.LeaveRequest;
import com.hr_management.hr_management.entity.LeaveType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LeaveTypeMapper {

    LeaveTypeResponse toLeaveTypeResponse(LeaveType leaveType);
    List<LeaveTypeResponse> toLeaveTypeResponse(List<LeaveType> leaveTypes);
}
