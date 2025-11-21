package com.hr_management.hr_management.repository;

import com.hr_management.hr_management.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank, Integer> {
    boolean existsByBankAccountNumber(String bankAccountNumber);

    boolean existsByBankName(String bankName);
}
