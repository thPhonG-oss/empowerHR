package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "PointPolicy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PointPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_policy_id")
    private Integer pointPolicyId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_being_applied")
    private Boolean isBeingApplied = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversion_rule_id", nullable = false)
    private ConversionRule conversionRule;

}
