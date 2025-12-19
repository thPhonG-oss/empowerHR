package com.hr_management.hr_management.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ParticipateInRequest {
    Integer employeeId;
    Integer runningActivityId;
}
