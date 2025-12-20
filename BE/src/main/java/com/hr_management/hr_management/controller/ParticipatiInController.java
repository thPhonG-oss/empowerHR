package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.service.ParticipateInService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/participateIn")
public class ParticipatiInController {
    ParticipateInService participateInService;
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteParticipatiIn(@PathVariable Integer id, JwtAuthenticationToken jwtAuthenticationToken){
        participateInService.deleteParticipateIn(id,jwtAuthenticationToken);
        return ApiResponse.<String>builder()
                .result("Cancellation successful")
                .build();
    }
}
