package com.hr_management.hr_management.dto.request;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TimeSheetRequestDto {
    String reason;
    String request_type;
    LocalDate attendanceDate;
    LocalTime checkinTime;
    LocalTime checkoutTime;
}
