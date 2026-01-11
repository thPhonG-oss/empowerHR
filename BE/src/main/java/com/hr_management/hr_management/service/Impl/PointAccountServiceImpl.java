package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.PointAccountResponse;
import com.hr_management.hr_management.dto.response.PointAccountResponseDTO;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.PointAccount;
import com.hr_management.hr_management.entity.PointPolicy;
import com.hr_management.hr_management.mapper.PointAccountMapper;
import com.hr_management.hr_management.repository.PointAccountRepository;
import com.hr_management.hr_management.repository.PointPolicyRepository;
import com.hr_management.hr_management.repository.TransactionRepository;
import com.hr_management.hr_management.service.PointAccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PointAccountServiceImpl implements PointAccountService {
    PointAccountRepository pointAccountRepository;
    PointAccountMapper pointAccountMapper;
    TransactionRepository transactionRepository;
    PointPolicyRepository pointPolicyRepository;

    @Override
    public PointAccountResponseDTO createNewPointAccount() {
        PointAccount pointAccount = PointAccount.builder().build();
        return pointAccountMapper.toPointAccountResponseDTO(pointAccountRepository.save(pointAccount));
    }

    @Override
    public List<PointAccountResponse> getAllPointAccounts() {
        List<PointAccount> pointAccounts = pointAccountRepository.findAll();

        return pointAccounts.stream()
                .map(pointAccount -> {
                    PointAccountResponse dto = pointAccountMapper.toPointAccountResponse(pointAccount);

                    // Set employee name if employee exists
                    if (pointAccount.getEmployee() != null) {
                        dto.setEmployeeName(pointAccount.getEmployee().getEmployeeName());
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }
}
