package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.entity.RunningActivity;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParticipateInDetailsResponseDTO {
    Integer participateInId;
    Integer employeeId;
    RunningActivityResponseDTO runningActivity;
    String employeeName;
    String activityTitle;
    Integer totalRun;
    Boolean isCompleted;
    LocalDateTime completedDate;
    Integer rankPosition;
    Integer rewardPoints;
    Boolean isCancelled;
}
