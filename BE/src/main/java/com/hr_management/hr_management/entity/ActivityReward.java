package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ActivityReward")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "transaction_id")
public class ActivityReward extends Transaction {
    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "earned_points")
    private Integer earnedPoints;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "running_activity_id", nullable = false)
    private RunningActivity runningActivity;
}
