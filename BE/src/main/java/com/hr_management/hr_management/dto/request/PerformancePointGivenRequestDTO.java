package com.hr_management.hr_management.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PerformancePointGivenRequestDTO {
    Integer employeeId;
    Integer points;
    String message;
}
