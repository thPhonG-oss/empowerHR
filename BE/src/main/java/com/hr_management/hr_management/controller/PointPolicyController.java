package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.response.PointPolicyResponseDTO;
import com.hr_management.hr_management.service.RewardService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/point-policies")
public class PointPolicyController {

    RewardService rewardService;

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<PointPolicyResponseDTO>> getCurrentPointPolicy() {
        PointPolicyResponseDTO currentPolicy = rewardService.getCurrentPointPolicy();

        return ResponseEntity.ok(
                ApiResponse.<PointPolicyResponseDTO>builder()
                        .code("1000")
                        .message("Current point policy retrieved successfully.")
                        .result(currentPolicy)
                        .build()
        );
    }
}
