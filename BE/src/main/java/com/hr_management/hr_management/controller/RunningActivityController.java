package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.response.ActivityResponse;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.service.ActivityService;
import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.request.RunningActivityUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.service.RunningActivityService;
import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

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
  
  // Define REST endpoints here
    @GetMapping("/admin/activities")
    public ApiResponse<Page<RunningActivityResponseDTO>> getAllActivities(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<RunningActivityResponseDTO> activities = runningActivityService.getAllActivities(pageNumber, pageSize);
        return ApiResponse.<Page<RunningActivityResponseDTO>>builder()
                .message("Get all activities successfully")
                .data(activities);
      }

    // [ Admin ] Update activitiy
    @PutMapping("/admin/update-activities/{runningActivityId}")
    ApiResponse<RunningActivityResponseDTO> updateActivity(@PathVariable Integer runningActivityId, @Valid @RequestBody RunningActivityUpdateRequestDTO runningActivityUpdateRequestDTO){
        RunningActivityResponseDTO runningActivityResponseDTO= runningActivityService.updateActivity(runningActivityId,runningActivityUpdateRequestDTO);
        return ApiResponse.<RunningActivityResponseDTO>builder()
                .message("Update thành công")
                .data(runningActivityResponseDTO)
                .build();
    }
}
