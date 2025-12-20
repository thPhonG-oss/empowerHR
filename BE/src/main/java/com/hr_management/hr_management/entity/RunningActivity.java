package com.hr_management.hr_management.entity;

import com.hr_management.hr_management.enums.ActivityStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "RunningActivity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RunningActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "running_activity_id")
    private Integer runningActivityId;

    @Column(name = "title", nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "registration_start_date")
    private LocalDateTime registrationStartDate;

    @Column(name = "registration_end_date")
    private LocalDateTime registrationEndDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "min_participant")
    private Integer minParticipant;

    @Column(name = "max_participant")
    private Integer maxParticipant;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ActivityStatus status = ActivityStatus.Draft;

    @Column(name = "target_distance", length = 50)
    private Integer targetDistance;

    @Column(name = "rules", columnDefinition = "TEXT")
    private String rules;

    @Column(name = "completion_bonus")
    private Integer completionBonus;

    @Column(name = "top_1_bonus")
    private Integer top1Bonus;

    @Column(name = "top_2_bonus")
    private Integer top2Bonus;

    @Column(name = "top_3_bonus")
    private Integer top3Bonus;
}
