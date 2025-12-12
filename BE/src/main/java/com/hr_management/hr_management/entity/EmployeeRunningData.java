package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "EmployeeRunningData")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class EmployeeRunningData {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    Integer runningDataId;

    @Column(name = "strava_activity_id", unique = true, nullable = false)
    private Long stravaActivityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "name", columnDefinition = "TEXT")
    private String name; // Tên buổi chạy (vd: "Morning Run")

    @Column(name = "distance")
    private Double distance; // Đơn vị: mét

    @Column(name = "moving_time")
    private Integer movingTime; // Đơn vị: giây

    @Column(name = "elapsed_time")
    private Integer elapsedTime; // Tổng thời gian trôi qua (giây)

    @Column(name = "activity_type", length = 50)
    private String activityType; // Run, TrailRun, Walk...

    @Column(name = "start_date")
    private LocalDateTime startDate; // Thời gian bắt đầu chạy

    @Column(name = "average_speed")
    private Double averageSpeed; // m/s

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
