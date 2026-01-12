package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.TransactionResponse;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface TransactionService {
    List<TransactionResponse> getAllTransaction();
    List<TransactionResponse> getMyTransaction(JwtAuthenticationToken jwtAuthenticationToken);
    List<TransactionResponse> getTransactionById(Integer employeeId);

}
