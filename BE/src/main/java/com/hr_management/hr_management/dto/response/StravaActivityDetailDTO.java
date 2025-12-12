package com.hr_management.hr_management.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StravaActivityDetailDTO {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("distance")
    private Double distance; // Mét

    @JsonProperty("moving_time")
    private Integer movingTime; // Giây

    @JsonProperty("elapsed_time")
    private Integer elapsedTime;

    @JsonProperty("type")
    private String type; // "Run", "Ride", ...

    @JsonProperty("average_speed")
    private Double averageSpeed;

    @JsonProperty("start_date_local")
    private LocalDateTime startDateLocal;
}
