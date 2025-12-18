package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.StravaActivityDetailsDTO;

public interface StravaApiClient {
    StravaActivityDetailsDTO getActivityDetails(String accessToken, Long activityId);
}
