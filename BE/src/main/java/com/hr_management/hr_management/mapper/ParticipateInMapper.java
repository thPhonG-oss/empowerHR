package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.ParticipateInRequest;
import com.hr_management.hr_management.dto.response.ParticipateInDetailsResponseDTO;
import com.hr_management.hr_management.dto.response.ParticipateInResponse;
import com.hr_management.hr_management.entity.ParticipateIn;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {RunningActivityMapper.class})
public interface ParticipateInMapper {

//    ParticipateIn toParticipateIn(ParticipateInRequest participateInRequest);
    ParticipateInResponse toParticipateInResponse(ParticipateIn participateIn);

    @Mapping(target = "employeeId", source = "employee.employeeId")
    @Mapping(target = "employeeName", source = "employee.employeeName")
    @Mapping(target = "activityTitle", source = "runningActivity.title")
    ParticipateInDetailsResponseDTO toParticipateInDetailsResponseDTO(ParticipateIn participateIn);
}
