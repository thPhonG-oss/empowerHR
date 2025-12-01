package com.hr_management.hr_management.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class CheckinCheckoutResponse {
    LocalTime checkinTime;
    LocalTime checkoutTime;
}
