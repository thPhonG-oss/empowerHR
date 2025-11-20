package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "StravaConnections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StravaConnections {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "connection_id")
    private Integer connectionId;

    @Column(name = "access_token", columnDefinition = "TEXT")
    private String accessToken;

    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;

    @Column(name = "expires_at")
    private Long expiresAt;

    @Column(name = "strava_profile_url", length = 500)
    private String stravaProfileUrl;

    @Column(name = "strava_firstname", columnDefinition = "TEXT")
    private String stravaFirstname;

    @Column(name = "strava_lastname", columnDefinition = "TEXT")
    private String stravaLastname;

    @Column(name = "strava_username", columnDefinition = "TEXT")
    private String stravaUsername;

    @Column(name = "strava_athlete_id", length = 50)
    private String stravaAthleteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "connection_status", length = 50)
    private String connectionStatus;

    @Column(name = "connection_at")
    private LocalDateTime connectionAt;
}
