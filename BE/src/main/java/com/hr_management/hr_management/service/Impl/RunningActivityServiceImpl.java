package com.hr_management.hr_management.service.Impl;


import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.entity.*;
import com.hr_management.hr_management.dto.request.RunningActivityUpdateRequestDTO;
import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.enums.ActivityStatus;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.RunningActivityMapper;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.repository.RunningActivityRepository;
import com.hr_management.hr_management.service.RunningActivityService;
import com.hr_management.hr_management.utils.JwtUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RunningActivityServiceImpl implements RunningActivityService {
    RunningActivityRepository runningActivityRepository;
    RunningActivityMapper runningActivityMapper;
    ParticipateInRepository participateInRepository;

    @Override
    public Page<RunningActivityResponseDTO> getAllActivities(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("runningActivityId").descending());
        Page<RunningActivity> activitiesPage = runningActivityRepository.findAll(pageable);
        Page<RunningActivityResponseDTO> dtoPage =
                activitiesPage.map(activity -> {
                    RunningActivityResponseDTO dto =
                            runningActivityMapper.toRunningActivityResponseDTO(activity);

                    Integer numberRegistered =
                            participateInRepository
                                    .countByRunningActivity_RunningActivityIdAndIsCancelledFalse(
                                            activity.getRunningActivityId()
                                    );

                    dto.setNumberRegistered(numberRegistered);
                    return dto;
                });
        return dtoPage;
    }

    // Implement service methods here
    public RunningActivityResponseDTO updateActivity(Integer runningActivityId, RunningActivityUpdateRequestDTO requestDTO) {

        RunningActivity activity = runningActivityRepository.findById(runningActivityId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));


        ActivityStatus currentStatus = activity.getStatus();

        // Check permissions based on status
        if (currentStatus == ActivityStatus.Completed || currentStatus == ActivityStatus.Cancelled ||  currentStatus == ActivityStatus.Active) {
            throw new IllegalStateException("Cannot edit activity that has completed");
        }

//        if (currentStatus == ActivityStatus.Active) {
//
//            activity.setDescription(requestDTO.getDescription());
//            activity.setImage(requestDTO.getImage());
//            activity.setRules(requestDTO.getRules());
//            activity.setRegistrationEndDate(requestDTO.getRegistrationEndDate());
//
//            RunningActivity updatedActivity = runningActivityRepository.save(activity);
//            return runningActivityMapper.toRunningActivityResponseDTO(updatedActivity);
//        }


        LocalDate today = LocalDate.now();
        LocalDateTime today_1 = LocalDateTime.now();

        if (requestDTO.getRegistrationEndDate().isBefore(today_1)) {
            throw new IllegalArgumentException("Ngày kết thúc đăng kí không được ở trong quá khứ");
        }
        if (requestDTO.getStartDate().isBefore(today)) {
            throw new IllegalArgumentException("Ngày bắt đầu hoạt động không được ở quá khứ");
        }
        if (requestDTO.getEndDate().isBefore(today)) {
            throw new IllegalArgumentException("Ngày kết thúc hoạt động không được ở quá khứ");
        }

        LocalDateTime startDateTime = requestDTO.getStartDate().atStartOfDay();

        if (requestDTO.getRegistrationEndDate().isAfter(startDateTime)) {
            throw new IllegalArgumentException(
                    "Ngày kết thúc đăng ký phải trước hoặc bằng thời điểm bắt đầu hoạt động"
            );
        }

        if (requestDTO.getStartDate().isAfter(requestDTO.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu hoạt động phải trước hoặc bằng ngày kết thúc hoạt động");
        }

        // Validate participant counts
        if (requestDTO.getMinParticipant() == null || requestDTO.getMaxParticipant() == null) {
            throw new IllegalArgumentException("Số người tham gia tối thiểu và tối đa không được để trống");
        }
        if (requestDTO.getMinParticipant() < 1) {
            throw new IllegalArgumentException("Số người tối thiểu phải ≥ 1");
        }
        if (requestDTO.getMaxParticipant() < 1) {
            throw new IllegalArgumentException("Số người tối đa phải ≥ 1");
        }
        if (requestDTO.getMaxParticipant() < requestDTO.getMinParticipant()) {
            throw new IllegalArgumentException("Số người tối đa phải ≥ số người tối thiểu");
        }

        // Validate target distance
        if (requestDTO.getTargetDistance() == null || requestDTO.getTargetDistance() <= 0) {
            throw new IllegalArgumentException("Cự ly mục tiêu phải tồn tại và lớn hơn 0");
        }

        // Validate bonus points
        if (requestDTO.getCompletionBonus() == null || requestDTO.getCompletionBonus() <= 0) {
            throw new IllegalArgumentException("Thưởng hoàn thành phải > 0");
        }
        if (requestDTO.getTop1Bonus() == null || requestDTO.getTop1Bonus() <= 0) {
            throw new IllegalArgumentException("Thưởng top 1 phải > 0");
        }
        if (requestDTO.getTop2Bonus() == null || requestDTO.getTop2Bonus() <= 0) {
            throw new IllegalArgumentException("Thưởng top 2 phải > 0");
        }
        if (requestDTO.getTop3Bonus() == null || requestDTO.getTop3Bonus() <= 0) {
            throw new IllegalArgumentException("Thưởng top 3 phải > 0");
        }

        runningActivityMapper.updateActivity(activity,requestDTO);
        runningActivityRepository.save(activity);
        return runningActivityMapper.toRunningActivityResponseDTO(activity);
    }

    @Override
    public RunningActivityResponseDTO deleteActivity(Integer runningActivityId) {
        RunningActivity activity = runningActivityRepository.findById(runningActivityId)
                .orElseThrow(() -> new AppException(ErrorCode.ACTIVITY_NOT_FOUND));

        if (!ActivityStatus.Draft.equals(activity.getStatus())) {
            throw new AppException(ErrorCode.ACTIVITY_DELETE_NOT_ALLOWED);
        }

        List<ParticipateIn> participations = participateInRepository.findAll()
                .stream()
                .filter(p -> p.getRunningActivity().getRunningActivityId().equals(runningActivityId))
                .collect(Collectors.toList());
        participateInRepository.deleteAll(participations);

        runningActivityRepository.deleteById(runningActivityId);


        return runningActivityMapper.toRunningActivityResponseDTO(activity);
    }
}
