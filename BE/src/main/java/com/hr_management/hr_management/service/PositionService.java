package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.PositionResponseDTO;

import java.util.List;

public interface PositionService {
    List<PositionResponseDTO> getAllPositions();
}
