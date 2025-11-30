package com.hr_management.hr_management.dto.request;

import com.hr_management.hr_management.enums.LocationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckOutRequest {
    private String ipCheckout;
    LocationStatus checkoutLocationStatus;
}
