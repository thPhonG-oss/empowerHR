package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.RunningActivityUpdateRequestDTO;
import com.hr_management.hr_management.dto.request.RunningActivityUpdateStatusRequest;
import com.hr_management.hr_management.dto.response.ParticipateInResponse;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface RunningActivityService {
    Page<RunningActivityResponseDTO> getAllActivities(Integer pageNumber, Integer pageSize);
    RunningActivityResponseDTO updateActivity(Integer runningActivityId, RunningActivityUpdateRequestDTO requestDTO);
    RunningActivityResponseDTO deleteActivity(Integer runningActivityId);
    void updateRunningActivityStatuses();
    RunningActivityResponseDTO updateStatusActivity(Integer runningActivityId, RunningActivityUpdateStatusRequest runningActivityUpdateStatusRequest);
}
