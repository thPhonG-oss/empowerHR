package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.PointPolicyResponseDTO;
import com.hr_management.hr_management.entity.PointPolicy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PointPolicyMapper {
    PointPolicyResponseDTO toPointPolicyResponseDTO(PointPolicy pointPolicy);
}
