package com.hr_management.hr_management.dto.response;


import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.RunningActivity;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class ParticipateInResponse {

    private Integer participateInId;
    private String employeeName;
    private Integer employeeId;
    private Boolean isCancelled;
    private RunningActivity runningActivity;
    private Integer totalRun;
    private Boolean isCompleted ;
    LocalDateTime completedDate;
    private Integer rankPosition;
    private Integer rewardPoints;

}
