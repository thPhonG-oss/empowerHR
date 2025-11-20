package com.hr_management.hr_management.dto.request;

import com.hr_management.hr_management.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeUpdateRequestDTO {
    private String employeeCode;
    private String employeeName;
    private String address;
    private String email;
    private String phoneNumber;
    private Boolean isActive;
    private LocalDateTime updatedAt;
    private String taxCode;
    private Integer positionId;
    private Integer departmentId;
}
