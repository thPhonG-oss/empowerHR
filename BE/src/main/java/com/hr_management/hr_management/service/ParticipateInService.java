package com.hr_management.hr_management.service;

import jakarta.transaction.Transactional;

public interface ParticipateInService {
    void sortCurrentParticipantsPositions(Integer runningActivityId);

    @Transactional
    void updateParticipantTotalRun(Integer participateInId, Integer additionalRun);
    void deleteParticipateIn(Integer id);
}

