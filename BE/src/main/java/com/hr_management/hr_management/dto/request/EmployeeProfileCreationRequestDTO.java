package com.hr_management.hr_management.dto.request;

import com.hr_management.hr_management.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private LocalDate dateOfBirth;
    private Gender gender;
    private String email;
    private String phoneNumber;
    private String taxCode;
    private Integer positionId;
    private Integer departmentId;
    private String bankName;
    private String bankBranch;
    private String bankAccountNumber;
    private Set<String> roles = new HashSet<>();
}
