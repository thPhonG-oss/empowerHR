package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.StravaEventDTO;
import jakarta.transaction.Transactional;

public interface StravaWebhookService {
    @Transactional
    void processEvenAsync(StravaEventDTO event);
}
