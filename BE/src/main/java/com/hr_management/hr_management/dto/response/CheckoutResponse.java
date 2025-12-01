package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.enums.LocationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CheckoutResponse {
    LocalTime checkoutTime;
    String ipCheckout;
    LocationStatus checkoutLocationStatus;
}
