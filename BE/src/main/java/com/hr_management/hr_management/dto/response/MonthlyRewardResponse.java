package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.entity.Position;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRewardResponse {
    Integer monthlyRewardId;
    PositionResponse position;
    Integer monthlyPoints;
    LocalDate startDate;
    LocalDate endDate;
    Boolean isActive;
}
