package com.hr_management.hr_management.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankResponseDTO {
    private Integer bankId;
    private String bankName;
    private String branch;
    private String bankAccountNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
