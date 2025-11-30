package com.hr_management.hr_management.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class LeaveRequestDto {
    String reason;
    String request_type;
    LocalDate startDate;
    LocalDate endDate;
    String proofDocument;
    Integer leaveTypeId;
}
