package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.LeaveTypeResponse;
import com.hr_management.hr_management.entity.LeaveType;

import java.util.List;

public interface LeaveTypeService {
    List<LeaveTypeResponse> getAll();
}
