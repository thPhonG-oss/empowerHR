package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.PositionResponseDTO;
import com.hr_management.hr_management.entity.Position;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.PositionMapper;
import com.hr_management.hr_management.repository.PositionRepository;
import com.hr_management.hr_management.service.PositionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PositionServiceImpl implements PositionService {

    PositionRepository positionRepository;
    PositionMapper positionMapper;

    @Override
    public List<PositionResponseDTO> getAllPositions(){
        List<Position> positions = positionRepository.findAll();

        if(positions.isEmpty()){
            throw new AppException(ErrorCode.JOB_POSITION_IS_EMPTY);
        }

        List<PositionResponseDTO> positionResponseDTOs = new ArrayList<>();
        for (Position position : positions) {
            positionResponseDTOs.add(positionMapper.toPositionResponseDTO(position));
        }

        return positionResponseDTOs;
    }
}
