package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction,Integer> {

    List<Transaction> findByPointAccount_PointAccountIdOrderByCreateAtDesc(Integer pointAccountId);


}
