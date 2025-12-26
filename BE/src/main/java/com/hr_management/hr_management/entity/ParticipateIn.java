package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ParticipateIn")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipateIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participate_in_id")
    private Integer participateInId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "running_activity_id", nullable = false)
    @ToString.Exclude
    private RunningActivity runningActivity;

    @Column(name = "total_run")
    private Integer totalRun = 0;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "completed_date")
    LocalDateTime completedDate;

    @Column(name = "rank_position")
    private Integer rankPosition;

    @Column(name = "reward_points")
    private Integer rewardPoints = 0;
    @Column(name="is_canncelled")
    private  Boolean isCancelled=false;
}

