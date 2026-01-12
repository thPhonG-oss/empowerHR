package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.PointPolicyUpdateRequestDTO;
import com.hr_management.hr_management.dto.response.PointPolicyResponseDTO;
import com.hr_management.hr_management.service.RewardService;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/rewards")
public class RewardController {
    RewardService rewardService;

    @GetMapping("/point-policies")
    public ResponseEntity<List<PointPolicyResponseDTO>> getAllPointPolicies() {
        return ResponseEntity.ok().body(rewardService.getAllPointPolicies());
    }

    @PutMapping("/point-policies/{id}")
    public ResponseEntity<PointPolicyResponseDTO> updatePointPolicy(@PathVariable Integer id, @RequestBody PointPolicyUpdateRequestDTO requestDTO) {
        PointPolicyResponseDTO updatedPolicy = rewardService.updatePointPolicy(id, requestDTO);
        return ResponseEntity.ok().body(updatedPolicy);
    }
}
