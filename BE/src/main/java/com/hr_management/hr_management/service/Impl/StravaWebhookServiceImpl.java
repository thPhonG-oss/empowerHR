package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.StravaActivityDetailDTO;
import com.hr_management.hr_management.dto.response.StravaEventDTO;
import com.hr_management.hr_management.entity.EmployeeRunningData;
import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.entity.StravaConnections;
import com.hr_management.hr_management.enums.ActivityStatus;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.exception.StravaUnauthorizedException;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.EmployeeRunningDataRepository;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.repository.StravaConnectionRepository;
import com.hr_management.hr_management.service.EmployeeService;
import com.hr_management.hr_management.service.StravaWebhookService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.util.RateLimiter;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StravaWebhookServiceImpl implements StravaWebhookService {

    StravaConnectionRepository stravaConnectionRepository;
    StravaApiClient stravaApiClient;
    EmployeeRepository employeeRepository;
    RestTemplate restTemplate = new RestTemplate();
    private final EmployeeRunningDataRepository employeeRunningDataRepository;
    private final ParticipateInServiceImpl participateInService;
    private final ParticipateInRepository participateInRepository;

    @NonFinal
    RateLimiter rateLimiter;

    @Override
    @Transactional
    @Async("webhookTaskExecutor")
    public void processEvenAsync(StravaEventDTO event) {
        try{
            log.info("Starting async processing for Strava event: {}", event.getObjectId());
            processEvent(event);
            log.info("Successfully processed Strava event asynchronously: {}", event.getObjectId());
        }
        catch(Exception ex){
            log.error("Failed to process Strava event asynchronously: {}", event.getObjectId(), ex);
        }
    }

    private void processEvent(StravaEventDTO event){
        log.debug("Looking up strava connection for athlete_id: {}", event.getOwnerId());
        StravaConnections connections = stravaConnectionRepository.findByStravaAthleteId(String.valueOf(event.getOwnerId()));
        if(connections == null){
            log.warn("No Strava connection found for athlete_id: {}", event.getOwnerId());
            throw new AppException(ErrorCode.CONNECTION_NOT_FOUND);
        }

        log.info("Found Strava connection for athlete_id: {}, employee_id: {}", event.getOwnerId(), connections.getEmployee().getEmployeeId());

        String accessToken = connections.getAccessToken();
        // Here you would typically call Strava API to fetch activity details using the access token
        // For brevity, we'll just log the access token
        log.debug("Using access token: {} to fetch activity details for activity_id: {}", accessToken, event.getObjectId());
        // Simulate processing the activity
        log.info("Processed Strava activity_id: {} for employee_id: {}", event.getObjectId(), connections.getEmployee().getEmployeeId());
        StravaActivityDetailDTO activityDetail = new StravaActivityDetailDTO();
        // Populate activityDetail with data fetched from Strava API
        try{
            activityDetail = stravaApiClient.getActivityDetails(accessToken, event.getObjectId());
        }
        catch(StravaUnauthorizedException e){
            log.error("Unauthorized access when fetching activity details for activity_id: {}", event.getObjectId(), e);
            throw e;
        }

        log.info("Fetched activity: type={}, distance={}m, time={}s",
                activityDetail.getType(),
                activityDetail.getDistance(),
                activityDetail.getMovingTime()
        );
        // Tạo mới EmployeeRunningData
        EmployeeRunningData employeeRunningData = EmployeeRunningData.builder().build();
        employeeRunningData.setEmployee(connections.getEmployee());
        employeeRunningData.setStravaActivityId(activityDetail.getId());
        Double distanceInKm = activityDetail.getDistance() / 1000.0;
        employeeRunningData.setDistance(distanceInKm);
        employeeRunningData.setMovingTime(activityDetail.getMovingTime());
        employeeRunningData.setStartDate(activityDetail.getStartDateLocal());

        EmployeeRunningData savedEmployeeRunningData = employeeRunningDataRepository.save(employeeRunningData);

        ParticipateIn participateIn = participateInRepository.findByEmployee_EmployeeIdAndRunningActivity_Status(
                connections.getEmployee().getEmployeeId(),
                ActivityStatus.Active
        );

        // Cập nhật total run cho ParticipateIn
        participateInService.updateParticipantTotalRun(participateIn.getParticipateInId(), distanceInKm.intValue());
        // Sắp xếp lại vị trí xếp hạng
        participateInService.sortCurrentParticipantsPositions(participateIn.getRunningActivity().getRunningActivityId());
    }
}
