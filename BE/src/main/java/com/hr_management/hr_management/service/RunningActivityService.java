package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.StravaActivityDetailDTO;
import com.hr_management.hr_management.entity.Employee;
import com.hr_management.hr_management.entity.RunningActivity;
import jakarta.transaction.Transactional;

public interface RunningActivityService {
    // Implement service methods here
    @Transactional
    void processActivity(Employee employee, StravaActivityDetailDTO activityDetail);
}
