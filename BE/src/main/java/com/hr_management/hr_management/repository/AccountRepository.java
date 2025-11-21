package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account,Integer> {
    Optional<Account> findByUsername(String username);
    Boolean existsByUsername(String username);
}
