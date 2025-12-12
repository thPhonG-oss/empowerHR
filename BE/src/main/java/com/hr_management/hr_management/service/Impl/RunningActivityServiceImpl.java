package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.StravaActivityDetailDTO;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.EmployeeRunningData;
import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.mapper.RunningActivityMapper;
import com.hr_management.hr_management.repository.EmployeeRunningDataRepository;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.repository.RunningActivityRepository;
import com.hr_management.hr_management.service.RunningActivityService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RunningActivityServiceImpl implements RunningActivityService {
    RunningActivityRepository runningActivityRepository;
    RunningActivityMapper runningActivityMapper;
    EmployeeRunningDataRepository  employeeRunningDataRepository;
    ParticipateInRepository participateInRepository;

    // Implement service methods here
    @Transactional
    @Override
    public void processActivity(Employee employee, StravaActivityDetailDTO activityDetail) {
        // Implementation logic to process running activity
        log.info("Processing running activity for employee: {}", employee.getEmployeeId());

        if("Run".equalsIgnoreCase(activityDetail.getType())){
            log.info("Skipping non-running activity: type={}", activityDetail.getType());
            return;
        }

        if(employeeRunningDataRepository.existsByStravaActivityId(activityDetail.getId())){
            log.warn("Activity {} already processed, skipping.", activityDetail.getId());
            return;
        }

        Double distanceInKm = activityDetail.getDistance() / 1000.0;
        log.info("Saving running activity: activity_id={}, distance={}km, time={}s",
                activityDetail.getId(),
                distanceInKm,
                activityDetail.getMovingTime()
        );

        Double avgSpeedKmh = (activityDetail.getAverageSpeed()) * 3.6;
        log.info("Average speed for activity {}: {} km/h", activityDetail.getId(), avgSpeedKmh);

        EmployeeRunningData employeeRunningData = EmployeeRunningData.builder().build();
        employeeRunningData.setEmployee(employee);
        employeeRunningData.setStravaActivityId(activityDetail.getId());
        employeeRunningData.setDistance(distanceInKm);
        employeeRunningData.setMovingTime(activityDetail.getMovingTime());
        employeeRunningData.setElapsedTime(activityDetail.getElapsedTime());
        employeeRunningData.setActivityType(activityDetail.getType());
        employeeRunningData.setCreatedAt(LocalDateTime.now());
        employeeRunningDataRepository.save(employeeRunningData);
    }
}
