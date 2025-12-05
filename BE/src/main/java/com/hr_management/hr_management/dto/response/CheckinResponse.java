package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.enums.LocationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;
import java.time.LocalTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class CheckinResponse {
    String ipCheckin;
    LocalTime checkinTime;
    LocationStatus checkinLocationStatus;
}
