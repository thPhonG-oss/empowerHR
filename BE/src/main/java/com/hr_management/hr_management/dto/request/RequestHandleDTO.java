package com.hr_management.hr_management.dto.request;

import com.hr_management.hr_management.enums.RequestStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RequestHandleDTO {

    @NotNull(message = "Request status must be not null.")
    private RequestStatus requestStatus;

    @NotBlank(message = "Response reason must be not blank.")
    private String responseReason;
}
