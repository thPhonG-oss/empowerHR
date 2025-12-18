package com.hr_management.hr_management.service;

import com.hr_management.hr_management.dto.response.StravaEventDTO;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Async;

public interface StravaWebhookService {
    @Transactional
    @Async("webhookTaskExecutor")
    void processEvenAsync(StravaEventDTO event);
}
