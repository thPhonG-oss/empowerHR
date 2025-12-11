package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @ToString.Exclude
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "pointAccount")
    private Employee employee;

}