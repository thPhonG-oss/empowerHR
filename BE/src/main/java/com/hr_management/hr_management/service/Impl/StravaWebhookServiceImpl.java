package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.StravaActivityDetailsDTO;
import com.hr_management.hr_management.dto.response.StravaEventDTO;
import com.hr_management.hr_management.entity.EmployeeRunningData;
import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.entity.StravaConnections;
import com.hr_management.hr_management.enums.ActivityStatus;
import com.hr_management.hr_management.exception.StravaUnauthorizedException;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.EmployeeRunningDataRepository;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.repository.StravaConnectionRepository;
import com.hr_management.hr_management.service.ParticipateInService;
import com.hr_management.hr_management.service.StravaApiClient;
import com.hr_management.hr_management.service.StravaWebhookService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StravaWebhookServiceImpl implements StravaWebhookService {
    StravaConnectionRepository stravaConnectionRepository;
    StravaApiClient stravaApiClient;
    EmployeeRepository employeeRepository;
    EmployeeRunningDataRepository employeeRunningDataRepository;
    RestTemplate restTemplate;
    ParticipateInRepository participateInRepository;
    ParticipateInService participateInService;


    @Transactional
    @Async("webhookTaskExecutor")
    @Override
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
        // Tìm kết nối Strava dựa trên ownerId (athleteId)
        log.debug("Looking up connection for athlete_id: {}", event.getOwnerId());

        StravaConnections connections = stravaConnectionRepository.findByStravaAthleteId(String.valueOf(event.getOwnerId()));

        if(connections == null){
            log.error("No Strava connection found for athlete_id: {}", event.getOwnerId());
            return;
        }

        log.info("Found Strava connection for athlete_id: {}, employee_id: {}", event.getOwnerId(), connections.getEmployee().getEmployeeId());

        String accessToken = connections.getAccessToken();

        log.debug("Using access token: {} to fetch activity details for activity_id: {}", accessToken, event.getObjectId());
        // Simulate processing the activity
        log.info("Processed Strava activity_id: {} for employee_id: {}", event.getObjectId(), connections.getEmployee().getEmployeeId());

        StravaActivityDetailsDTO activityDetail = new StravaActivityDetailsDTO();


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

        // Kiểm tra nhân viên có tham gia hoạt động nào hiện tại hay không, nếu có thì cập nhật tổng km chạy
        ParticipateIn participateIn = participateInRepository.findByEmployee_EmployeeIdAndRunningActivity_Status(
                connections.getEmployee().getEmployeeId(),
                ActivityStatus.Active
        );

        if(participateIn == null){
            log.info("Employee_id: {} is not participating in any active running activity. Skipping total run update.",
                    connections.getEmployee().getEmployeeId());
            return;
        }

//         Cập nhật total run cho ParticipateIn
        participateInService.updateParticipantTotalRun(participateIn.getParticipateInId(), distanceInKm.intValue());
//         Sắp xếp lại vị trí xếp hạng
        participateInService.sortCurrentParticipantsPositions(participateIn.getRunningActivity().getRunningActivityId());
    }
}
