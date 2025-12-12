package com.hr_management.hr_management.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StravaConnectionsResponseDTO {
    String connectionId;
    Long expiresAt;
    String stravaProfileUrl;
    String stravaFirstname;
    String stravaLastname;
    String stravaUsername;
    String stravaAthleteId;
    Long lastSyncAt;
    String scope;
    String connectionStatus;
    LocalDateTime connectionAt;
}
