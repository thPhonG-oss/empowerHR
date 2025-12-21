package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.response.ParticipateInResponse;
import com.hr_management.hr_management.service.ParticipateInService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @PostMapping("/register/{activityId}")
    public ApiResponse<ParticipateInResponse> registerActivity(
            @PathVariable Integer activityId,
            JwtAuthenticationToken jwtToken) {

        String username = jwtToken.getName();
        ParticipateInResponse result = participateInService.registerActivity(activityId, username);
        return ApiResponse.<ParticipateInResponse>builder()
                .message("Đăng ký thành công hoạt động")
                .result(result)
                .build();
    }
}
