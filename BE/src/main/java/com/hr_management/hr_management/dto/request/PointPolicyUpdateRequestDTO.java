package com.hr_management.hr_management.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointPolicyUpdateRequestDTO {
    private Long expiry;
    private Integer minPoints;
    private Integer maxPoints;
    private Double conversionRate;
    private LocalDate endDate;
    private Boolean isActive;
}
