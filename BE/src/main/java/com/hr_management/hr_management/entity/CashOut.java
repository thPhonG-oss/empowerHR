package com.hr_management.hr_management.entity;

import jakarta.persistence.*;
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
@DiscriminatorValue("CashOut")
public class CashOut extends Transaction {
    @Column(name = "cash_amount", nullable = false)
    private Long cashAmount;
}
