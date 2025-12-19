package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.RunningActivityUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.ParticipateInResponse;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import org.springframework.data.domain.Page;

public interface RunningActivityService {
    Page<RunningActivityResponseDTO> getAllActivities(Integer pageNumber, Integer pageSize);
    RunningActivityResponseDTO updateActivity(Integer runningActivityId, RunningActivityUpdateRequestDTO requestDTO);
}
