package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.service.RunningActivityService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RunningActivityController {
    RunningActivityService runningActivityService;

    // Define REST endpoints here

    @GetMapping("/admin/activities")
    public ApiResponse<Page<RunningActivityResponseDTO>> getAllActivities(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<RunningActivityResponseDTO> activities = runningActivityService.getAllActivities(pageNumber, pageSize);
        return ApiResponse.<Page<RunningActivityResponseDTO>>builder()
                .message("Get all activities successfully")
                .data(activities)
                .build();
    }



}
