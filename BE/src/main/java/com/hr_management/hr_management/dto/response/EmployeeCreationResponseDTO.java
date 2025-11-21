package com.hr_management.hr_management.dto.response;

import com.hr_management.hr_management.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeCreationResponseDTO {
    private Integer employeeId;
    private String employeeCode;
    private String employeeName;
    private String identityCard;
    private String address;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String email;
    private String phoneNumber;
    private LocalDate startingDate;
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String taxCode;
    private Long pointBalance;
    private PositionResponseDTO position;
    private DepartmentResponseDTO department;
    private BankResponseDTO bank;
    private AccountResponseDTO account;
}
