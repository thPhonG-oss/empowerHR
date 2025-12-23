package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.ActivityRequets;
import com.hr_management.hr_management.dto.response.ActivityResponse;
import com.hr_management.hr_management.dto.response.ActivityResponseDto;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;

import java.util.List;

public interface ActivityService {
    ActivityResponse createRunningActivity(ActivityRequets activityRequets);
    ActivityResponse viewDetailActivity(Integer activityId);
    List<ActivityResponseDto> getAllActivity();
}
