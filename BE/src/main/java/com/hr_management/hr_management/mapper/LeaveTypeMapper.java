package com.hr_management.hr_management.mapper;


import com.hr_management.hr_management.dto.response.LeaveTypeResponse;
import com.hr_management.hr_management.entity.LeaveRequest;
import com.hr_management.hr_management.entity.LeaveType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LeaveTypeMapper {

    LeaveTypeResponse toLeaveTypeResponse(LeaveType leaveType);
}
