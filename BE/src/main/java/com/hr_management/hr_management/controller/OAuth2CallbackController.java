package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.service.StravaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/oauth2/callback")
public class OAuth2CallbackController {

    StravaService stravaService;

    @PostMapping
    public ResponseEntity<?> handleStravaCallback(
            @RequestParam("state") String state,
            @RequestParam("code") String code,
            @RequestParam("scope") String scope
    ) {
        return new ResponseEntity<>(
                stravaService.connectStravaAccount(code, state),
                HttpStatus.CREATED
        );
    }
}
