package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.RunningActivity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<RunningActivity,Integer> {
    RunningActivity findByTitle(String title);
}
