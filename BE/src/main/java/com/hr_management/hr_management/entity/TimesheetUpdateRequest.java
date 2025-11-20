package com.hr_management.hr_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "TimesheetUpdateRequest")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "request_id")
//@Builder
public class TimesheetUpdateRequest extends Request {

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "checkin_time")
    private LocalTime checkinTime;

    @Column(name = "checkout_time")
    private LocalTime checkoutTime;
}
