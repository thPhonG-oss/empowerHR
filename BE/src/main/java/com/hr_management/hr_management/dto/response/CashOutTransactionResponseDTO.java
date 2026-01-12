package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.enums.TransactionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CashOutTransactionResponseDTO {
    Integer transactionId;
    LocalDateTime transactionDate;
    Long points;
    Long cashAmount;
    TransactionType transactionType;
    Integer pointAccountId;
    Integer employeeId;
}
