package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.RunningActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RunningActivityRepository extends JpaRepository<RunningActivity, Integer> {
    // Define custom query methods here if needed
}
