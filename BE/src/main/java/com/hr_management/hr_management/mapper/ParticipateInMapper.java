package com.hr_management.hr_management.mapper;

import com.hr_management.hr_management.dto.request.ParticipateInRequest;
import com.hr_management.hr_management.dto.response.ParticipateInResponse;
import com.hr_management.hr_management.entity.ParticipateIn;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ParticipateInMapper {

//    ParticipateIn toParticipateIn(ParticipateInRequest participateInRequest);
    ParticipateInResponse toParticipateInResponse(ParticipateIn participateIn);
}
