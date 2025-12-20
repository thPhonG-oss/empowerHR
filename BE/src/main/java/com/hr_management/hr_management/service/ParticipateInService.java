package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.ParticipateInResponse;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface ParticipateInService {
    void sortCurrentParticipantsPositions(Integer runningActivityId);

    @Transactional
    void updateParticipantTotalRun(Integer participateInId, Integer additionalRun);
    void deleteParticipateIn(Integer id, JwtAuthenticationToken jwtAuthenticationToken);

    ParticipateInResponse registerActivity(Integer activityId, String username);
}

