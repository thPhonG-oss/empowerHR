package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.TimeSheetRequestDto;
import com.hr_management.hr_management.dto.response.TimeSheetResponse;
import com.hr_management.hr_management.entity.TimesheetUpdateRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TimeSheetUpdateMapper {
    TimeSheetResponse toTimeSheetResponse (TimesheetUpdateRequest timesheetUpdateRequest);
    TimesheetUpdateRequest toTimeSheetUpdateRequest(TimeSheetRequestDto timeSheetRequestDto);
}
