package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.request.RequestHandleDTO;
import com.hr_management.hr_management.service.RequestService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestController {
    RequestService requestService;

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
}
