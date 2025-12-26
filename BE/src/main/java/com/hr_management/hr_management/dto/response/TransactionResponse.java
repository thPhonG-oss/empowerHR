package com.hr_management.hr_management.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.hr_management.hr_management.entity.PointAccount;
import com.hr_management.hr_management.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionResponse {

    private Integer transactionId;
    private Long points;
    private TransactionType transactionType;
    private Integer pointAccountId;
    private Integer employeeId;
    private String employeeName;
    private LocalDateTime createAt;
}
