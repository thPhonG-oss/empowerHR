package com.hr_management.hr_management.entity;

import com.hr_management.hr_management.enums.LocationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Integer attendanceId;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "checkin_time")
    private LocalTime checkinTime;

    @Column(name = "checkout_time")
    private LocalTime checkoutTime;

    @Column(name = "working_hours")
    private Long workingHours;

    @Column(name = "IP_checkin", length = 45)
    private String ipCheckin;

    @Column(name = "IP_checkout", length = 45)
    private String ipCheckout;

    @Enumerated(EnumType.STRING)
    @Column(name = "checkin_location_status")
    private LocationStatus checkinLocationStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "checkout_location_status")
    private LocationStatus checkoutLocationStatus;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

//    @ManyToOne(fetch = FetchType.LAZY)
    // Update: giữ mặc định fetch type của ManyToOne là EAGER
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

}
