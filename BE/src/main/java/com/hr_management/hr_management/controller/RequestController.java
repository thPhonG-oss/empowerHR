package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.service.RequestService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestController {
    RequestService requestService;

    @GetMapping("/{requestId}")
    public ResponseEntity<Object> getRequestById(@PathVariable("requestId") Integer requestId){
        return null;
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
                                .result(requestService.getRequestById(requestId))
                                .build()
                );
    }
}
