package com.hr_management.hr_management.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RunningActivityResponseDTO {
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
