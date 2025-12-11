package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.service.RunningActivityService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RunningActivityController {
    RunningActivityService runningActivityService;

    // Define REST endpoints here
}
