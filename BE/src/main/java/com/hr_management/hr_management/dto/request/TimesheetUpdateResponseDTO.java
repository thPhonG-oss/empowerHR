package com.hr_management.hr_management.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TimesheetUpdateResponseDTO extends RequestResponseDTO {
    private LocalDate attendanceDate;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;
}