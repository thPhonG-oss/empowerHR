package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.ActivityRequets;
import com.hr_management.hr_management.dto.response.ActivityResponse;
import com.hr_management.hr_management.entity.RunningActivity;
import org.mapstruct.Mapper;
package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.entity.RunningActivity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RunningActivityMapper {
    RunningActivity toRunningActivity(ActivityRequets activityRequets);
    ActivityResponse toActivityResponse(RunningActivity activity);
    RunningActivityResponseDTO toRunningActivityResponseDTO(RunningActivity runningActivity);
}
