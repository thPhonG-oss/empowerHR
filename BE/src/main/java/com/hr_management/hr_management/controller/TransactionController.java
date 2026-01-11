package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.dto.request.ApiResponse;
import com.hr_management.hr_management.dto.response.RunningActivityResponseDTO;
import com.hr_management.hr_management.dto.response.TransactionResponse;
import com.hr_management.hr_management.service.TransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    TransactionService transactionService;

    @GetMapping("")
    public ApiResponse<Page<TransactionResponse>> getAllTransactions(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<TransactionResponse> transactions = transactionService.getAllTransaction(pageNumber, pageSize);
        return ApiResponse.<Page<TransactionResponse>>builder()
                .message("Get all transactions successfully")
                .result(transactions)
                .build();
    }

    @GetMapping("/my")
    public ApiResponse<List<TransactionResponse>> getMyTransaction(JwtAuthenticationToken jwtAuthenticationToken){
        List<TransactionResponse> transactions = transactionService.getMyTransaction(jwtAuthenticationToken);
        return ApiResponse.<List<TransactionResponse>>builder()
                .message("Get all transactions successfully")
                .result(transactions)
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<List<TransactionResponse>> getTransactionByEmployee(Integer employeeId){
        List<TransactionResponse> transactions = transactionService.getTransactionById(employeeId);
        return ApiResponse.<List<TransactionResponse>>builder()
                .message("Get transactions successfully")
                .result(transactions)
                .build();
    }
}
