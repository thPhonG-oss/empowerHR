package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.entity.ParticipateIn;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.repository.ParticipateInRepository;
import com.hr_management.hr_management.service.ParticipateInService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ParticipateInServiceImpl implements ParticipateInService {
    ParticipateInRepository participateInRepository;
    @Override
    public void deleteParticipateIn(Integer id) {
        ParticipateIn participateIn=participateInRepository.findById( id).orElseThrow(()-> new AppException(ErrorCode.PARTICIPITEIN_NOT_EXIST));
        participateIn.setIsCancelled(true);
        participateInRepository.save(participateIn);
        return;
    }
}
