package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class LeaveRequestResponse {
    Integer requestId;
    LocalDateTime submitAt;
    String reason;
    LocalDate startDate;
    LocalDate endDate;
    String proofDocument;
    LeaveTypeResponse leaveTypeResponse;
}
