package com.hr_management.hr_management.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StravaEventDTO {
    @JsonProperty("object_type")
    String objectType; // "activity" hoặc "athlete"

    @JsonProperty("object_id")
    Long objectId;     // ID của hoạt động (activity_id)

    @JsonProperty("aspect_type")
    String aspectType; // "create", "update", "delete"

    @JsonProperty("owner_id")
    Long ownerId;      // ID của Strava User (để tìm ra nhân viên nào)

    @JsonProperty("subscription_id")
    Integer subscriptionId;

    @JsonProperty("event_time")
    Long eventTime;

    @JsonProperty("updates")
    java.util.Map<String, Object> updates; // Chứa các trường thay đổi (nếu là update)
}
