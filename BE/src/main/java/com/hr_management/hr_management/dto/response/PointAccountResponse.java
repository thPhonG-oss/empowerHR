package com.hr_management.hr_management.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PointAccountResponse {
    String employeeName;

    String departmentName;
    Integer departmentId;
    String positionName;
    Integer positionId;

    Integer pointAccountId;
    Long currentPoints;
    Integer totalEarns;
    Integer totalTransferred;
    LocalDateTime createdAt;
    LocalDateTime updateAt;
}
