package com.hr_management.hr_management.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hr_management.hr_management.enums.ActivityStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class ActivityRequets {
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
}
