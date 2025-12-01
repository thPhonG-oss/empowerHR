package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.LeaveType;
import com.hr_management.hr_management.enums.LocationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendanceResponse {
    Integer attendanceId;
    LocalDate attendanceDate;
    LocalTime checkinTime;
    LocalTime checkoutTime;
    Long workingHours;
    String ipCheckin;
    String ipCheckout;
    LocationStatus checkinLocationStatus;
    LocationStatus checkoutLocationStatus;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
