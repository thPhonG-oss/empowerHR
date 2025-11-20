package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.*;
import com.hr_management.hr_management.dto.response.AuthenticationResponse;
import com.hr_management.hr_management.dto.response.IntrospectResponse;
import com.hr_management.hr_management.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RequestMapping("auth")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    @PostMapping("/log-in")
    ApiResponse<AuthenticationResponse> authenticated (@RequestBody @Valid AuthenticateRequest authenticateRequest){
        AuthenticationResponse result=authenticationService.authenticate(authenticateRequest);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
}