package com.hr_management.hr_management.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "Other")
@Data
@AllArgsConstructor
@PrimaryKeyJoinColumn(name = "transaction_id")
@SuperBuilder
@DiscriminatorValue("Other")
public class Other extends Transaction{
}
