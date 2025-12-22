package com.hr_management.hr_management.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ActivityResponseDto {
    Integer runningActivityId;
    String title;
    String image;
    String description;
    LocalDate registrationStartDate;
    LocalDate registrationEndDate;
    LocalDate startDate;
    LocalDate endDate;
    Integer minParticipant;
    Integer maxParticipant;
    String status;
    Integer targetDistance;
    String rules;
    Integer completionBonus;
    Integer top1Bonus;
    Integer top2Bonus;
    Integer top3Bonus;
    Integer numberRegistered;
}
