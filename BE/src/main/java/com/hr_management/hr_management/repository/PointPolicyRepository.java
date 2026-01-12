package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.PointPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PointPolicyRepository extends JpaRepository<PointPolicy, Integer> {
    PointPolicy findByIsActive(Boolean isActive);

    @Query(
            value = "SELECT p FROM PointPolicy p WHERE p.isActive = true"
    )
    PointPolicy findActivePolicy();
}
