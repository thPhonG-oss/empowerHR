package com.hr_management.hr_management.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PointPolicyResponseDTO {
    Integer pointPolicyId;
    Long expiry;
    Integer minPoints;
    Integer maxPoints;
    Double conversionRate;
    LocalDate startDate;
    LocalDate endDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isActive;
}
