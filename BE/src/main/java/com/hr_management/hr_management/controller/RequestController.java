package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.HandledRequestResponseDTO;
import com.hr_management.hr_management.enums.RequestStatus;
import com.hr_management.hr_management.service.EmployeeService;
import com.hr_management.hr_management.service.RequestService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestController {
    RequestService requestService;
    EmployeeService employeeService;

    @GetMapping("/{requestId}")
    public ResponseEntity<Object> getRequestById(@PathVariable("requestId") Integer requestId){
        return ResponseEntity.ok(requestService.getRequestById(requestId));
    }
    @GetMapping("/handled")
    public ResponseEntity<Object> getHandledRequests(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize
    ) {
        return ResponseEntity.ok()
                .body(
                        ApiResponse.builder()
                                .code("1000")
                                .message("Success")
                                .result(requestService.getAllHandledRequests(pageNumber, pageSize))
                                .build()
                );
    }
    @PatchMapping("/{requestId}")
    public ResponseEntity<Object> handleRequest(@RequestBody @Valid RequestHandleDTO requestHandleDTO, @PathVariable(name = "requestId") Integer requestId){
        return ResponseEntity.ok()
                .body(
                        ApiResponse.builder()
                                .code("1000")
                                .message("Success")
                                .result(requestService.handleRequest(requestHandleDTO, requestId))
                                .build()
                );
    }

    // [ Employee ]
    // 1. get my request
    @GetMapping("/my-request")
    public ResponseEntity<Object> getMyRequests(
            JwtAuthenticationToken jwtToken,
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(name = "statuses", required = false) List<RequestStatus> status
    ) {
        String username = jwtToken.getName();
        EmployeeResponseDTO profile = employeeService.getEmployeeByUserName(username);

        HandledRequestResponseDTO myRequests = requestService.getMyRequests(
                profile.getEmployeeId(),
                pageNumber,
                pageSize,
                status  // ← Pass statuses
        );

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .code("1000")
                        .message("Success")
                        .result(myRequests)
                        .build()
        );
    }







}
