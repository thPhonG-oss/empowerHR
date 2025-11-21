package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPositonRepository extends JpaRepository<Position, Integer> {
}
