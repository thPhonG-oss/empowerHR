package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Request;
import com.hr_management.hr_management.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Integer> {
    Page<Request> findByStatusIn(List<RequestStatus> processedStatuses, Pageable pageable);
}
