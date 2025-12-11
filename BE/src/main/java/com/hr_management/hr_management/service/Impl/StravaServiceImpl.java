package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.StravaConnectionsResponseDTO;
import com.hr_management.hr_management.dto.response.StravaTokenResponseDTO;
import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.StravaConnections;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.StravaConnectionMapper;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.StravaConnectionRepository;
import com.hr_management.hr_management.service.StravaService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class StravaServiceImpl implements StravaService {

    EmployeeRepository employeeRepository;
    AccountRepository accountRepository;
    StravaConnectionRepository stravaConnectionRepository;
    StravaConnectionMapper stravaConnectionMapper;

    @NonFinal
    RestTemplate restTemplate = new RestTemplate();


    @NonFinal
    @Value("${security.oauth2.client.registration.strava.client-id}")
    String clientId;

    @NonFinal
    @Value("${security.oauth2.client.registration.strava.client-secret}")
    String clientSecret;

    @NonFinal
    @Value("${security.oauth2.client.registration.strava.scope}")
    String scope;

    @NonFinal
    @Value("${security.oauth2.client.registration.strava.redirect-uri}")
    String redirectUri;

    @NonFinal
    @Value("${security.oauth2.client.provider.strava.authorization-uri}")
    private String authorizationUri;

    @NonFinal
    @Value("${security.oauth2.client.provider.strava.token-uri}")
    private String tokenUri;

    @Override
    public String getAuthorizationUrl() {
        // Trả về URL ủy quyền Strava
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = null;
        log.info("Instance of authentication: {}", authentication.getClass().toString());

        if(authentication instanceof JwtAuthenticationToken){
            Jwt jwt = (Jwt) authentication.getPrincipal();

            username = jwt.getSubject();
            log.info("Jwt subject: {}", username);
        }

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Employee employee = employeeRepository.findAllByAccount_AccountId(account.getAccountId());

        if(employee == null){
            throw new RuntimeException("Employee not found");
        }


       return authorizationUri +
               "?client_id=" + clientId +
               "&response_type=code" +
               "&redirect_uri=" + redirectUri +
               "&approval_prompt=force" +
               "&scope=" + scope +
               "&state=" + username;
    }// State để identify user sau khi callback

    @Transactional
    @Override
    public StravaConnectionsResponseDTO connectStravaAccount(String code, String state) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Account account = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if(state == null || !state.equals(account.getUsername())){
            throw new AppException(ErrorCode.INVALID_STRAVA_STATE);
        }

        Employee employee = employeeRepository.findAllByAccount_AccountId(account.getAccountId());
        if(employee == null || !employee.getAccount().getUsername().equals(state)){
            throw new AppException(ErrorCode.EMPLOYEE_NOT_FOUND);
        }

        StravaTokenResponseDTO tokenResponseDTO = exchangeCodeForToken(code, state);
        StravaConnections connections =   stravaConnectionRepository.findByEmployee_EmployeeId(employee.getEmployeeId());

        if(connections != null && connections.getConnectionStatus().equals("Connected")){
            connections.setAccessToken(tokenResponseDTO.getAccessToken());
            connections.setRefreshToken(tokenResponseDTO.getRefreshToken());
            connections.setExpiresAt(tokenResponseDTO.getExpiresAt());
            connections.setConnectionAt(LocalDateTime.now());
            StravaConnections updatedConnection = stravaConnectionRepository.save(connections);
            return stravaConnectionMapper.stravaConnectionsResponseDTO(updatedConnection);
        }

        StravaConnections stravaConnections = StravaConnections.builder()
                .employee(employee)
                .accessToken(tokenResponseDTO.getAccessToken())
                .refreshToken(tokenResponseDTO.getRefreshToken())
                .expiresAt(tokenResponseDTO.getExpiresAt())
                .stravaProfileUrl(tokenResponseDTO.getAthlete().getProfile())
                .stravaFirstname(tokenResponseDTO.getAthlete().getFirstname())
                .stravaLastname(tokenResponseDTO.getAthlete().getLastname())
                .stravaUsername(tokenResponseDTO.getAthlete().getUsername())
                .stravaAthleteId(String.valueOf(tokenResponseDTO.getAthlete().getId()))
                .scope("read,activity:read_all")
                .connectionStatus("Connected")
                .connectionAt(java.time.LocalDateTime.now())
                .build();

        StravaConnections savedConnection = stravaConnectionRepository.save(stravaConnections);

        return stravaConnectionMapper.stravaConnectionsResponseDTO(savedConnection);
    }

    @Transactional
    protected StravaTokenResponseDTO exchangeCodeForToken(String code, String state) {
        // prepare request body to exchange code for token
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("client_id", clientId);
        requestBody.add("client_secret", clientSecret);
        requestBody.add("code", code);
        requestBody.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            // call strava token endpoint
            ResponseEntity<StravaTokenResponseDTO> response = restTemplate.postForEntity(
                    tokenUri,
                    requestEntity,
                    StravaTokenResponseDTO.class
            );
            StravaTokenResponseDTO responseDTO = response.getBody();
            assert responseDTO != null;
            log.info("Exchanged token: {}", responseDTO.getAthlete().toString());
            return responseDTO;
        }
        catch (Exception e){
            log.error("Error exchanging code for token: {}", e.getMessage());
            throw new AppException(ErrorCode.STRAVA_TOKEN_EXCHANGE_FAILED);
        }
    }
}
