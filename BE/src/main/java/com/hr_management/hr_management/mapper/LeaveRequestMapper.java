package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.LeaveRequestDto;
import com.hr_management.hr_management.dto.response.LeaveRequestResponse;
import com.hr_management.hr_management.entity.LeaveRequest;
import com.hr_management.hr_management.entity.Request;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",uses ={LeaveTypeMapper.class})
public interface LeaveRequestMapper {
    LeaveRequest toLeaveRequest(LeaveRequestDto leaveRequestDto);
    @Mapping(source = "leaveType", target = "leaveTypeResponse")
    LeaveRequestResponse toLeaveRequestResponse(LeaveRequest leaveRequest);

}
