package com.hr_management.hr_management.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class ParticipateInResponse {

    private Integer participateInId;
    private Integer employeeId;
    private Integer runningActivityId;
    private Boolean isCancelled;
}
