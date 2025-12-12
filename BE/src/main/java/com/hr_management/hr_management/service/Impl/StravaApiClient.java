package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.StravaActivityDetailDTO;
import com.hr_management.hr_management.exception.StravaApiException;
import com.hr_management.hr_management.exception.StravaNotFoundException;
import com.hr_management.hr_management.exception.StravaUnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.util.RateLimiter;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StravaApiClient {

    private RestTemplate restTemplate;
    private RateLimiter rateLimiter;

    public StravaActivityDetailDTO getActivityDetails(String accessToken, Long activityId) {
        // Implementation to call Strava API and fetch activity details
        String url = "https://www.strava.com/api/v3/activities/" + activityId;
        // Set up headers and make the API call
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        log.debug("GET {}", url);
        // Here you would typically use restTemplate.exchange() to make the call
        try{
            ResponseEntity<StravaActivityDetailDTO> response = restTemplate.exchange(url, HttpMethod.GET, entity, StravaActivityDetailDTO.class);

            if(response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                log.error("Failed to fetch activity details: HTTP {}", response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new StravaUnauthorizedException("Invalid or expired token");
            } else if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                throw new StravaNotFoundException("Activity not found");
            }
            throw new StravaApiException("API error: " + e.getMessage());
        }
        return null;
    }
}
