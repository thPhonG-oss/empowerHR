package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "MonthlyReward")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(MonthlyRewardId.class)
public class MonthlyReward {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "point_policy_id")
    private PointPolicy pointPolicy;

    @Column(name = "monthly_points")
    private Integer monthlyPoints = 0;
}