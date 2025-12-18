package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.service.ParticipateInService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/participateIn")
public class ParticipatiInController {
    ParticipateInService participateInService;
    @PostMapping("/{id}")
    public ApiResponse<String> deleteParticipatiIn(@PathVariable Integer id){
        participateInService.deleteParticipateIn(id);
        return ApiResponse.<String>builder()
                .result("Cancellation successful")
                .build();
    }
}
