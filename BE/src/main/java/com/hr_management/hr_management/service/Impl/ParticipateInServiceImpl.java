package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.service.ParticipateInService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.service.ParticipateInService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ParticipateInServiceImpl implements ParticipateInService {
    ParticipateInRepository participateInRepository;
  
    @Override
    public void deleteParticipateIn(Integer id) {
        ParticipateIn participateIn=participateInRepository.findById( id).orElseThrow(()-> new AppException(ErrorCode.PARTICIPITEIN_NOT_EXIST));
        participateIn.setIsCancelled(true);
        participateInRepository.save(participateIn);
        return;
    }

    @Override
    public void sortCurrentParticipantsPositions(Integer runningActivityId){
        List<ParticipateIn> currentParticipants = participateInRepository.findAllByRunningActivity_RunningActivityId(runningActivityId);

        SortedSet<ParticipateIn> sortedSet = sortParticipantsByTotalRun(currentParticipants);
        Integer rankPosition = 1;
        for(ParticipateIn participant : sortedSet){
            participant.setRankPosition(rankPosition);
            participateInRepository.save(participant);
            rankPosition++;
        }
    }

    @Transactional
    @Override
    public void updateParticipantTotalRun(Integer participateInId, Integer additionalRun){
        ParticipateIn participant = participateInRepository.findById(participateInId)
                .orElseThrow(() -> new IllegalArgumentException("ParticipateIn not found with id: " + participateInId));
        Integer newTotalRun = participant.getTotalRun() + additionalRun;
        participant.setTotalRun(newTotalRun);
        participateInRepository.save(participant);
    }

    private SortedSet<ParticipateIn> sortParticipantsByTotalRun(List<ParticipateIn> participants){
        SortedSet<ParticipateIn> sortedParticipants = new TreeSet<>((p1, p2) -> {
            Integer totalRun1 = p1.getTotalRun();
            Integer totalRun2 = p2.getTotalRun();
            return totalRun2.compareTo(totalRun1); // Descending order
        });
        sortedParticipants.addAll(participants);
        return sortedParticipants;
    }
}
