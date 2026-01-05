package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.EmployeeResponseDTO;
import com.hr_management.hr_management.dto.response.TransactionResponse;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.entity.Transaction;
import com.hr_management.hr_management.enums.TransactionType;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.mapper.TransactionMapper;
import com.hr_management.hr_management.repository.EmployeeRepository;
import com.hr_management.hr_management.repository.TransactionRepository;
import com.hr_management.hr_management.service.EmployeeService;
import com.hr_management.hr_management.service.TransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TransactionServiceImpl implements TransactionService {
    TransactionRepository transactionRepository;
    TransactionMapper transactionMapper;
    EmployeeRepository employeeRepository;
    EmployeeService employeeService;
    @Override
    public Page<TransactionResponse> getAllTransaction(Integer pageNumber, Integer pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createAt").descending());
        Page<Transaction> transactionPage = transactionRepository.findAll(pageable);
        Page<TransactionResponse> transactionResponsePage = transactionPage.map(transaction -> {
            TransactionResponse res =
                    transactionMapper.toTransactionResponse(transaction);

            res.setPointAccountId(
                    transaction.getPointAccount().getPointAccountId()
            );

            res.setEmployeeId(
                    transaction.getPointAccount().getEmployee().getEmployeeId()
            );

            res.setEmployeeName(
                    transaction.getPointAccount().getEmployee().getEmployeeName()
            );
            res.setTransactionType(
                    TransactionType.valueOf(transaction.getClass().getSimpleName())
            );

            return res;
        });
        return transactionResponsePage;
    }

    @Override
    public List<TransactionResponse> getMyTransaction(JwtAuthenticationToken jwtAuthenticationToken) {
        String username = jwtAuthenticationToken.getName();

        // Tìm employee dựa vào username
        Employee employee = employeeRepository
                .findByAccount_Username(username)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));

        // Lấy pointAccountId từ employee
        Integer pointAccountId = employee.getPointAccount().getPointAccountId();

        // Lấy list giao dịch
        List<Transaction> transactions = transactionRepository
                .findByPointAccount_PointAccountIdOrderByCreateAtDesc(pointAccountId);


        return transactions.stream()
                .map(transaction -> {
                    TransactionResponse res = transactionMapper.toTransactionResponse(transaction);

                    res.setPointAccountId(transaction.getPointAccount().getPointAccountId());
                    res.setEmployeeId(transaction.getPointAccount().getEmployee().getEmployeeId());
                    res.setEmployeeName(transaction.getPointAccount().getEmployee().getEmployeeName());
                    res.setTransactionType(
                            TransactionType.valueOf(transaction.getClass().getSimpleName())
                    );

                    return res;
                })
                .collect(Collectors.toList());


    }
}
