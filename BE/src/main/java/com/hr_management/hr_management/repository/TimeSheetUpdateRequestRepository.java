package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.TimesheetUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeSheetUpdateRequestRepository extends JpaRepository<TimesheetUpdateRequest,Integer> {
}
