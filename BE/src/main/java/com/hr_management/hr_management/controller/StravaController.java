package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.response.StravaEventDTO;
import com.hr_management.hr_management.dto.response.StravaUrlResponse;
import com.hr_management.hr_management.service.StravaService;
import com.hr_management.hr_management.service.StravaWebhookService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/strava")
public class StravaController {
    StravaService stravaService;
    StravaWebhookService stravaWebhookService;

    @NonFinal
    @Value("${security.oauth2.client.registration.strava.verify-token}")
    String verifyToken;

    @GetMapping("/connect")
    public ResponseEntity<StravaUrlResponse> getStravaConnectUrl() {
        String authUrl = stravaService.getAuthorizationUrl();

        StravaUrlResponse response = new StravaUrlResponse(authUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/webhook")
    public ResponseEntity<?> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.challenge") String challenge,
            @RequestParam("hub.verify_token") String token
    ) {
        log.info("Verifying Strava webhook: mode={}, challenge={}, token={}", mode, challenge, token);
        if(!"subscribe".equals(mode) || !verifyToken.equals(token)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(Map.of("hub.challenge", challenge));
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhookEvent(@RequestBody StravaEventDTO event) {
        log.info("Received Strava webhook event: type={}, id={}, aspect={}, ownerId={}",
                event.getObjectType(), event.getObjectId(), event.getAspectType(), event.getOwnerId());

        if(!"create".equals(event.getAspectType())) {
            log.info("Skipping non-create event: aspect={}", event.getAspectType());
            return ResponseEntity.ok().build();
        }

        // Process the event asynchronously
        stravaWebhookService.processEvenAsync(event);
        return ResponseEntity.ok().build();
    }
}
