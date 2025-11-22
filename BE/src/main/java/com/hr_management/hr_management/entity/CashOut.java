package com.hr_management.hr_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "CashOut")
@Data
@NoArgsConstructor
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "transaction_id")
//Update: thêm annotation @SuperBuilder
@SuperBuilder
public class CashOut extends Transaction {
    @Column(name = "cash_amount", nullable = false)
    private Long cashAmount;
}
