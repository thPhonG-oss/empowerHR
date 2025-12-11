package com.hr_management.hr_management.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StravaTokenResponseDTO {
    @JsonProperty("token_type")
    String tokenType;

    @JsonProperty("expires_at")
    Long expiresAt; // Thời điểm hết hạn (Unix Timestamp)

    @JsonProperty("expires_in")
    Integer expiresIn; // Số giây còn lại cho đến khi hết hạn

    @JsonProperty("refresh_token")
    String refreshToken;

    @JsonProperty("access_token")
    String accessToken;

    @JsonProperty("athlete")
    StravaAthleteDTO athlete;
}
