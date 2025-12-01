package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.CheckInRequest;
import com.hr_management.hr_management.dto.request.CheckOutRequest;
import com.hr_management.hr_management.dto.response.CheckinResponse;
import com.hr_management.hr_management.dto.response.CheckoutResponse;
import com.hr_management.hr_management.entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    @Mapping(target = "checkinTime", expression = "java(java.time.LocalTime.now())")
    @Mapping(target = "attendanceDate", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    Attendance toAttendance(CheckInRequest checkInRequest);
    CheckinResponse toCheckinResponse(Attendance attendance);
    @Mapping(target = "checkoutTime", source = "checkoutTime")
    CheckoutResponse toCheckoutResponse(Attendance attendance);
    Attendance toAttendance(CheckOutRequest checkOutRequest);
}
