package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.ParticipateInResponse;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.enums.ActivityStatus;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.ParticipateInMapper;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.repository.RunningActivityRepository;
import com.hr_management.hr_management.service.ParticipateInService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ParticipateInServiceImpl implements ParticipateInService {
    ParticipateInRepository participateInRepository;
    EmployeeRepository employeeRepository;
    RunningActivityRepository runningActivityRepository;
    ParticipateInMapper participateInMapper;
  
    @Override
    public void deleteParticipateIn(Integer id, JwtAuthenticationToken jwtAuthenticationToken) {
        String username= jwtAuthenticationToken.getName();
        Integer employeeId=employeeRepository.findByAccount_Username(username).get().getEmployeeId();
        RunningActivity runningActivity=runningActivityRepository.findById(id).orElseThrow(()->new AppException(ErrorCode.ACTIVITY_NOT_EXIST));
        ParticipateIn participateIn=participateInRepository.findByEmployee_EmployeeIdAndRunningActivity_RunningActivityId(
                employeeId,runningActivity.getRunningActivityId())
                .orElseThrow(()->new AppException(ErrorCode.PARTICIPITEIN_NOT_EXIST));
        participateIn.setIsCancelled(true);
        participateInRepository.save(participateIn);
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

    @Override
    public ParticipateInResponse registerActivity(Integer activityId, String username) {

        Employee employee = employeeRepository.findByAccount_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXITS));

        if (!employee.getIsActive()) {
            throw new AppException(ErrorCode.EMPLOYEE_INACTIVED);
        }

        // Lấy thông tin hoạt động
        RunningActivity activity = runningActivityRepository.findById(activityId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));


        // Kiểm tra thời gian đăng ký
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(activity.getRegistrationStartDate()) ||
                now.isAfter(activity.getRegistrationEndDate())) {
            throw new AppException(ErrorCode.ACTIVITY_REGISTRATION_CLOSED);
        }

        // Kiểm tra nhân viên đã đăng ký chưa
        if (participateInRepository.existsByEmployeeAndRunningActivity(employee, activity)) {
            throw new AppException(ErrorCode.ACTIVITY_ALREADY_REGISTERED);
        }

        // Kiểm tra số lượng thí sinh
        Long currentParticipants = participateInRepository.countByRunningActivityAndIsCancelledFalse(activity);
        if (currentParticipants >= activity.getMaxParticipant()) {
            throw new AppException(ErrorCode.ACTIVITY_PARTICIPANT_LIMIT_REACHED);
        }

        ParticipateIn participateIn = ParticipateIn.builder()
                .employee(employee)
                .runningActivity(activity)
                .totalRun(0)
                .isCompleted(false)
                .isCancelled(false)
                .rewardPoints(0)
                .build();

        ParticipateIn saved = participateInRepository.save(participateIn);
        ParticipateInResponse participateInResponse = participateInMapper.toParticipateInResponse(saved);
        participateInResponse.setEmployeeId(saved.getEmployee().getEmployeeId());
        participateInResponse.setEmployeeName(saved.getEmployee().getEmployeeName());
        participateInResponse.setRunningActivity(saved.getRunningActivity());
        return participateInResponse;
    }
}
