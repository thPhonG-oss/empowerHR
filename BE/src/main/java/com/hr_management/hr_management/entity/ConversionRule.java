package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ConversionRule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversion_rule_id")
    private Integer conversionRuleId;

    @Column(name = "expiry")
    private Integer expiry = 365;

    @Column(name = "min_points")
    private Integer minPoints = 0;

    @Column(name = "max_points")
    private Integer maxPoints = 0;

    @Column(name = "conversion_rate", precision = 4, scale = 2)
    private BigDecimal conversionRate = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "effective_at")
    private LocalDateTime effectiveAt;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @Column(name = "is_begin_applied")
    private Boolean isBeginApplied = true;

}
