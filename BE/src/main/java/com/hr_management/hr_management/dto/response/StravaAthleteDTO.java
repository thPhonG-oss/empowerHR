package com.hr_management.hr_management.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@ToString
public class StravaAthleteDTO {
    @JsonProperty("id")
    Long id; // Quan trọng: Strava ID của user

    @JsonProperty("username")
    String username;

    @JsonProperty("firstname")
    String firstname;

    @JsonProperty("lastname")
    String lastname;

    @JsonProperty("profile")
    String profile; // Link ảnh avatar (nếu cần hiển thị)
}
