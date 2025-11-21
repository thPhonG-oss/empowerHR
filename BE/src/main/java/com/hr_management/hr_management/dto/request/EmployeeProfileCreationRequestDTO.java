package com.hr_management.hr_management.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeProfileCreationRequestDTO {
    @NotBlank
    private String employeeName;
    @NotBlank
    private String identityCard;
    @NotBlank
    private String address;
    private LocalDateTime dateOfBirth;
    private String gender;
    private String email;
    private String phoneNumber;
    private LocalDateTime updatedAt;
    private String taxCode;
    private Integer positionId;
    private Integer departmentId;
    private String bankName;
    private String bankBranch;
    private String bankAccountNumber;
}
