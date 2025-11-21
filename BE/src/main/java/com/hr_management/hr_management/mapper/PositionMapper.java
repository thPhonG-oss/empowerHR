package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.PositionResponseDTO;
import com.hr_management.hr_management.entity.Position;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PositionMapper {
    PositionResponseDTO toPositionResponseDTO(Position position);
}
