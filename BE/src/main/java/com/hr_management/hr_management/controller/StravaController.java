package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.response.StravaUrlResponse;
import com.hr_management.hr_management.service.StravaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/strava")
public class StravaController {
    StravaService stravaService;

    @GetMapping("/connect")
    public ResponseEntity<StravaUrlResponse> getStravaConnectUrl() {
        String authUrl = stravaService.getAuthorizationUrl();

        StravaUrlResponse response = new StravaUrlResponse(authUrl);
        return ResponseEntity.ok(response);
    }
}
