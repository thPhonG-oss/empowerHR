package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.request.RunningActivityUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;


public interface RunningActivityService {

    RunningActivityResponseDTO updateActivity(Integer runningActivityId, RunningActivityUpdateRequestDTO requestDTO);

}
