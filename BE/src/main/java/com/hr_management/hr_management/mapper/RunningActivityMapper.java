package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.entity.RunningActivity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RunningActivityMapper {
    // map from running activity entity to running activity response dto
    RunningActivityResponseDTO toRunningActivityResponseDTO(RunningActivity runningActivity);
}
