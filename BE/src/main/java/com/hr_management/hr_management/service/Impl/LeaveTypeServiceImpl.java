package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.dto.response.LeaveTypeResponse;
import com.hr_management.hr_management.entity.LeaveType;
import com.hr_management.hr_management.mapper.LeaveTypeMapper;
import com.hr_management.hr_management.repository.LeaveTypeRepository;
import com.hr_management.hr_management.service.LeaveTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LeaveTypeServiceImpl implements LeaveTypeService {
    LeaveTypeMapper leaveTypeMapper;
    LeaveTypeRepository leaveTypeRepository;
    @Override
    public List<LeaveTypeResponse> getAll() {
        return leaveTypeMapper.toLeaveTypeResponse(leaveTypeRepository.findAll());
    }
}
