package com.hr_management.hr_management.dto.response;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Mapper
@Builder
public class BankResponse {




    private Integer bankId;


    private String bankName;


    private String branch;


    private String bankAccountNumber;


    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;
}
