package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.StravaActivityDetailsDTO;
import com.hr_management.hr_management.exception.StravaApiException;
import com.hr_management.hr_management.exception.StravaNotFoundException;
import com.hr_management.hr_management.exception.StravaUnauthorizedException;
import com.hr_management.hr_management.service.StravaApiClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class StravaApiClientImpl implements StravaApiClient {
    RestTemplate restTemplate;


    @Override
    public StravaActivityDetailsDTO getActivityDetails(String accessToken, Long activityId) {
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
            ResponseEntity<StravaActivityDetailsDTO> response = restTemplate.exchange(url, HttpMethod.GET, entity, StravaActivityDetailsDTO.class);

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
