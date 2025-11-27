package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.response.RequestResponseDTO;
import com.hr_management.hr_management.service.RequestService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/requests")
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RequestController {

    RequestService requestService;

    @GetMapping
    public ResponseEntity<List<RequestResponseDTO>> getRequests() {
        return ResponseEntity.ok().body(requestService.getAllRequests());
    }

    @GetMapping("/handled")
    public ResponseEntity<Object> getALlHandledRequests(
            @RequestParam(name = "pageNumber", required = false, defaultValue = "1") Integer pageNumber,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize
    ) {
       return ResponseEntity.ok().body(
               ApiResponse.builder()
                       .status(1000)
                       .message("Success")
                       .data(requestService.getAllHandledRequest(pageSize, pageNumber))
                       .build()
       );
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<Object> findRequestById(@PathVariable Integer requestId) {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .status(1000)
                        .message("Success")
                        .data(requestService.getRequestById(requestId))
                        .build()
        );
    }
}
