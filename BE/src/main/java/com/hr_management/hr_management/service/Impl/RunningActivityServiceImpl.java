package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.mapper.RunningActivityMapper;
import com.hr_management.hr_management.repository.RunningActivityRepository;
import com.hr_management.hr_management.service.RunningActivityService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RunningActivityServiceImpl implements RunningActivityService {
    RunningActivityRepository runningActivityRepository;
    RunningActivityMapper runningActivityMapper;

    @Override
    public Page<RunningActivityResponseDTO> getAllActivities(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("runningActivityId").descending());
        Page<RunningActivity> activitiespage = runningActivityRepository.findAll(pageable);
        return activitiespage.map(runningActivityMapper::toRunningActivityResponseDTO);
    }

    // Implement service methods here
}
