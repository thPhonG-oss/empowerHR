package com.hr_management.hr_management.service.Impl;

import com.hr_management.hr_management.repository.EmployeeRunningDataRepository;
import com.hr_management.hr_management.service.EmployeeRunningDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmployeeRunningDataServiceImpl implements EmployeeRunningDataService {
    private final EmployeeRunningDataRepository employeeRunningDataRepository;
}
