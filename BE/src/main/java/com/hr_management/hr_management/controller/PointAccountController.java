package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.ApiResponse;
import com.hr_management.hr_management.dto.response.PointAccountResponse;
import com.hr_management.hr_management.service.PointAccountService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/point-account")
public class PointAccountController {
    PointAccountService pointAccountService;

    @GetMapping("")
    public ApiResponse<List<PointAccountResponse>> getAllPointAccounts() {
        List<PointAccountResponse> pointAccounts = pointAccountService.getAllPointAccounts();
        return ApiResponse.<List<PointAccountResponse>>builder()
                .message("Get all point accounts successfully")
                .data(pointAccounts)
                .build();
    }
}
