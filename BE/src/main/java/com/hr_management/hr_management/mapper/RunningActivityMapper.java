package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.ActivityRequets;
import com.hr_management.hr_management.dto.request.RunningActivityUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.ActivityResponse;
import com.hr_management.hr_management.entity.RunningActivity;
import org.mapstruct.Mapper;
import org.mapstruct.*;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;

@Mapper(componentModel = "spring")
public interface RunningActivityMapper {
    RunningActivity toRunningActivity(ActivityRequets activityRequets);
    ActivityResponse toActivityResponse(RunningActivity activity);
    RunningActivityResponseDTO toRunningActivityResponseDTO(RunningActivity runningActivity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateActivity(@MappingTarget RunningActivity runningActivity, RunningActivityUpdateRequestDTO requestDTO);
}
