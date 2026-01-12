package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.response.PointAccountResponse;
import com.hr_management.hr_management.dto.response.PointAccountResponseDTO;
import com.hr_management.hr_management.entity.PointAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PointAccountMapper {

    PointAccountResponseDTO toPointAccountResponseDTO(PointAccount pointAccount);

    @Mapping(target = "employeeId", source ="employee.employeeId" )
    PointAccountResponse toPointAccountResponse(PointAccount pointAccount);
}
