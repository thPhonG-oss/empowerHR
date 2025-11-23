package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.LeaveRequestResponseDTO;
import com.hr_management.hr_management.dto.request.RequestResponseDTO;
import com.hr_management.hr_management.dto.request.TimesheetUpdateResponseDTO;
import com.hr_management.hr_management.entity.LeaveRequest;
import com.hr_management.hr_management.entity.Request;
import com.hr_management.hr_management.entity.TimesheetUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RequestMapper {

    // 1. Hàm chuyển hướng chính (Dispatcher)
    default RequestResponseDTO toResponseDTO(Request request) {
        if (request == null) {
            return null;
        }

        // Kiểm tra kiểu thực tế (Runtime Type) để gọi đúng hàm map con
        if (request instanceof LeaveRequest) {
            return toLeaveDTO((LeaveRequest) request);
        } else if (request instanceof TimesheetUpdateRequest) {
            return toTimesheetDTO((TimesheetUpdateRequest) request);
        } else {
            // Trường hợp request cơ bản (nếu có)
            return toBaseDTO(request);
        }
    }

    // 2. Mapping cho LeaveRequest
    @Mapping(target = "requestType", constant = "LEAVE") // Gán cứng loại để FE biết
    @Mapping(target = "employeeName", source = "employee.employeeName")
    @Mapping(target = "leaveTypeName", source = "leaveType.leaveTypeName")
    // Map từ object con
    LeaveRequestResponseDTO toLeaveDTO(LeaveRequest request);

    // 3. Mapping cho TimesheetUpdateRequest
    @Mapping(target = "requestType", constant = "TIMESHEET_UPDATE")
    @Mapping(target = "employeeName", source = "employee.employeeName")
    TimesheetUpdateResponseDTO toTimesheetDTO(TimesheetUpdateRequest request);

    // 4. Mapping cơ bản (fallback)
    @Mapping(target = "requestType", constant = "OTHER")
    @Mapping(target = "employeeName", source = "employee.employeeName")
    RequestResponseDTO toBaseDTO(Request request);
}