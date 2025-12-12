package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.PointAccountResponseDTO;
import com.hr_management.hr_management.entity.PointAccount;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PointAccountMapper {

    PointAccountResponseDTO toPointAccountResponseDTO(PointAccount pointAccount);
}
