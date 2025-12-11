package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.PointAccountResponseDTO;
import com.hr_management.hr_management.entity.PointAccount;
import com.hr_management.hr_management.mapper.PointAccountMapper;
import com.hr_management.hr_management.repository.PointAccountRepository;
import com.hr_management.hr_management.service.PointAccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PointAccountServiceImpl implements PointAccountService {
    PointAccountRepository pointAccountRepository;
    PointAccountMapper pointAccountMapper;

    @Override
    public PointAccountResponseDTO createNewPointAccount() {
        PointAccount pointAccount = PointAccount.builder().build();
        return pointAccountMapper.toPointAccountResponseDTO(pointAccountRepository.save(pointAccount));
    }
}
