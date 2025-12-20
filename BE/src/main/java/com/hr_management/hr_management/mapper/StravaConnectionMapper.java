package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.StravaConnectionsResponseDTO;
import com.hr_management.hr_management.entity.StravaConnections;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StravaConnectionMapper {
    StravaConnectionsResponseDTO stravaConnectionsResponseDTO(StravaConnections stravaConnections);
}
