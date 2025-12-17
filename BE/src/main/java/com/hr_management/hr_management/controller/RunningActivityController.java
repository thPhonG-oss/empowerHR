package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.request.RunningActivityUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.service.RunningActivityService;
import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RunningActivityController {
    RunningActivityService runningActivityService;

    // Define REST endpoints here

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
