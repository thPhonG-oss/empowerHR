package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.response.ActivityResponse;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.service.ActivityService;
import com.hr_management.hr_management.service.RunningActivityService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/activity")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RunningActivityController {
    RunningActivityService runningActivityService;
    ActivityService activityService;
    @GetMapping("/{activityId}")
    public ApiResponse<ActivityResponse> viewDetaildActivity(@PathVariable Integer activityId){
        return ApiResponse.<ActivityResponse>builder()
                .result(activityService.viewDetailActivity(activityId))
                .build();
    }
    //Employee
    @GetMapping()
    public ApiResponse<List<RunningActivityResponseDTO>> getAll(){
        return ApiResponse.<List<RunningActivityResponseDTO>>builder()
                .result(activityService.getAllActivity())
                .build();
    }

}
