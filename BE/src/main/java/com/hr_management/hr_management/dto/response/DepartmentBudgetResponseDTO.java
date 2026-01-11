package com.hr_management.hr_management.dto.response;

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
public class DepartmentBudgetResponseDTO {
    Integer departmentBudgetId;
    Integer departmentId;
    String departmentName;
    Integer pointPolicyId;
    Integer budget;
    LocalDate startDate;
    LocalDate endDate;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
