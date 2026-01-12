package com.hr_management.hr_management.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class ActivityResponse {
    String title;
    String image;
    String description;
    LocalDateTime registrationStartDate;
    LocalDateTime registrationEndDate;
    LocalDate startDate;
    LocalDate endDate;
    Integer minParticipant;
    Integer maxParticipant;
    String targetDistance;
    String rules;
    Integer completionBonus;
    Integer top1Bonus;
    Integer top2Bonus;
    Integer top3Bonus;
}
