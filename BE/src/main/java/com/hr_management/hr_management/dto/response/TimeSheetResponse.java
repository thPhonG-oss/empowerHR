package com.hr_management.hr_management.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TimeSheetResponse {
    Integer requestId;
    LocalDateTime submitAt;
    String reason;
    LocalDate attendanceDate;
    LocalTime checkinTime;
    LocalTime checkoutTime;
}
