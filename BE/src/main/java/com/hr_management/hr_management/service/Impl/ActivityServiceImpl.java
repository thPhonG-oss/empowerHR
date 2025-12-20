package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.request.ActivityRequets;
import com.hr_management.hr_management.dto.response.ActivityResponse;
import com.hr_management.hr_management.dto.response.ActivityResponseDto;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.enums.ActivityStatus;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.RunningActivityMapper;
import com.hr_management.hr_management.repository.ActivityRepository;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.service.ActivityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ActivityServiceImpl implements ActivityService {
    RunningActivityMapper runningActivityMapper;
    ActivityRepository activityRepository;
    ParticipateInRepository participateInRepository;
    @Override
    public ActivityResponse createRunningActivity(ActivityRequets activityRequets) {
        if(activityRequets.getMaxParticipant()<=activityRequets.getMinParticipant())
            throw new AppException(ErrorCode.ACTIVITY_MAX_MUST_GREATER_THAN_MIN);

        if(activityRequets.getEndDate().isBefore(activityRequets.getStartDate()))
            throw new AppException((ErrorCode.ACTIVITY_END_DATE_INVALID));

        if(activityRequets.getRegistrationEndDate().isBefore(activityRequets.getRegistrationStartDate()))
            throw new AppException((ErrorCode.ACTIVITY_REGISTRATION_END_INVALID));
        if(activityRequets.getStartDate().isBefore(activityRequets.getRegistrationEndDate().toLocalDate()))
            throw new AppException(ErrorCode.ACTIVITY_START_BEFORE_REGISTRATION);
        if(activityRepository.findByTitle(activityRequets.getTitle())!=null)
            throw new AppException(ErrorCode.ACTIVITY_TITLE_ALREADY_EXISTS);
        RunningActivity runningActivity=runningActivityMapper.toRunningActivity(activityRequets);
        runningActivity.setStatus(ActivityStatus.Draft);
        return runningActivityMapper.toActivityResponse(activityRepository.save(runningActivity));
    }

    @Override
    public ActivityResponse viewDetailActivity(Integer activityId) {
        RunningActivity runningActivity=activityRepository.findById(activityId).orElseThrow(()->new AppException(ErrorCode.ACTIVITY_NOT_EXIST));
        return runningActivityMapper.toActivityResponse(runningActivity);
    }

    @Override
    public List<ActivityResponseDto> getAllActivity() {
        List<ActivityResponseDto> activityResponseDtos=activityRepository.findAllByStatusIn(
                List.of(ActivityStatus.Active, ActivityStatus.Completed)
        ).stream().map(runningActivityMapper::toActivityResponseDto).toList();
        activityResponseDtos.forEach(activityResponseDto -> {
            activityResponseDto.setNumberRegistered(participateInRepository.countByRunningActivity_RunningActivityIdAndIsCancelledFalse(activityResponseDto.getRunningActivityId()));
        });
        return  activityResponseDtos;
    }
}
