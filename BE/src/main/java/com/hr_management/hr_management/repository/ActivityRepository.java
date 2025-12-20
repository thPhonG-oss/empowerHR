package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.RunningActivity;
import com.hr_management.hr_management.enums.ActivityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<RunningActivity,Integer> {
    RunningActivity findByTitle(String title);
    List<RunningActivity> findAllByStatusIn(List<ActivityStatus> statuses);
}
