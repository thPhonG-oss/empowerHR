package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.request.ActivityRequets;
import com.hr_management.hr_management.dto.response.ActivityResponse;

public interface ActivityService {
    ActivityResponse createRunningActivity(ActivityRequets activityRequets);
}
