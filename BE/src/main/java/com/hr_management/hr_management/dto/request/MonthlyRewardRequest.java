package com.hr_management.hr_management.dto.request;

import com.hr_management.hr_management.entity.PointPolicy;
import com.hr_management.hr_management.entity.Position;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class MonthlyRewardRequest {
    Integer monthlyPoints;
}
