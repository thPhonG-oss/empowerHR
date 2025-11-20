package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "PointAccount")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_account_id")
    private Integer pointAccountId;

    @Column(name = "current_points")
    private Long currentPoints;

    @Column(name = "total_earns")
    private Integer totalEarns = 0;

    @Column(name = "total_transferred")
    private Integer totalTransferred = 0;

    @Column(name = "last_monthly_reward")
    private Integer lastMonthlyReward = 0;

    @Column(name = "last_performance_reward")
    private Integer lastPerformanceReward = 0;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", unique = true)
    private Employee employee;

}